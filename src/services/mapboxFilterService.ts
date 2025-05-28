
import { getMapboxToken, MAPBOX_CONFIG } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';

export interface FilterSearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  center: [number, number];
  radius: number;
  unit: 'km' | 'mi';
  transportMode: TransportMode;
  maxDuration?: number;
  limit?: number;
}

export interface FilterSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance: number;
  duration: number;
  rating?: number;
}

// Convert transport mode to Mapbox profile
const getMapboxProfile = (mode: TransportMode): string => {
  switch (mode) {
    case 'car': return 'driving';
    case 'walking': return 'walking';
    case 'cycling': return 'cycling';
    case 'bus': return 'driving'; // Fallback to driving for transit
    default: return 'driving';
  }
};

// Convert category to Mapbox category
const getMapboxCategory = (category?: string): string => {
  if (!category) return '';
  
  const categoryMap: Record<string, string> = {
    'restaurant': 'restaurant',
    'cafe': 'cafe',
    'magasin': 'shop',
    'hopital': 'hospital',
    'pharmacie': 'pharmacy',
    'ecole': 'school',
    'banque': 'bank',
    'essence': 'fuel',
    'parking': 'parking'
  };
  
  return categoryMap[category.toLowerCase()] || category;
};

// Search places with filters
export const searchPlacesWithFilters = async (params: FilterSearchParams): Promise<FilterSearchResult[]> => {
  const token = getMapboxToken();
  if (!token) {
    throw new Error('Token Mapbox manquant');
  }

  try {
    const { query, category, center, radius, unit, limit = 10 } = params;
    
    // Build search query
    let searchQuery = query || '';
    if (category && !query) {
      searchQuery = getMapboxCategory(category);
    }
    
    // Convert radius to meters for proximity search
    const radiusInMeters = unit === 'mi' ? radius * 1609.34 : radius * 1000;
    
    // Build URL for geocoding search with category filtering
    const url = new URL(`${MAPBOX_CONFIG.geocoding.endpoint}/${encodeURIComponent(searchQuery)}.json`);
    url.searchParams.set('access_token', token);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('proximity', `${center[0]},${center[1]}`);
    url.searchParams.set('country', MAPBOX_CONFIG.geocoding.country);
    url.searchParams.set('language', MAPBOX_CONFIG.geocoding.language);
    
    if (category) {
      const mapboxCategory = getMapboxCategory(category);
      if (mapboxCategory) {
        url.searchParams.set('types', 'poi');
        url.searchParams.set('category', mapboxCategory);
      }
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Erreur API Mapbox: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter results by radius and transform to our format
    const results: FilterSearchResult[] = [];
    
    for (const feature of data.features) {
      const coordinates: [number, number] = feature.geometry.coordinates;
      const distance = calculateDistance(center, coordinates);
      
      // Filter by radius
      const maxDistance = unit === 'mi' ? radius * 1.609344 : radius;
      if (distance <= maxDistance) {
        results.push({
          id: feature.id || `place-${results.length}`,
          name: feature.text || feature.place_name,
          address: feature.place_name,
          coordinates,
          category: feature.properties?.category || category || 'unknown',
          distance: Math.round(distance * 100) / 100,
          duration: Math.round(distance * 12), // Rough estimate: 5km/h walking speed
          rating: feature.properties?.rating
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Erreur lors de la recherche avec filtres:', error);
    throw error;
  }
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get directions with duration
export const getDirectionsWithFilters = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: TransportMode
): Promise<{ distance: number; duration: number; geometry?: any }> => {
  const token = getMapboxToken();
  if (!token) {
    throw new Error('Token Mapbox manquant');
  }

  try {
    const profile = getMapboxProfile(transportMode);
    const url = `${MAPBOX_CONFIG.directions.endpoint}/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    
    const response = await fetch(`${url}?access_token=${token}&geometries=geojson`);
    if (!response.ok) {
      throw new Error(`Erreur API Directions: ${response.status}`);
    }

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: Math.round(route.distance / 1000 * 100) / 100, // Convert to km
        duration: Math.round(route.duration / 60), // Convert to minutes
        geometry: route.geometry
      };
    }

    throw new Error('Aucun itinéraire trouvé');
  } catch (error) {
    console.error('Erreur lors du calcul d\'itinéraire:', error);
    throw error;
  }
};

// Create isochrone for radius visualization
export const createIsochrone = async (
  center: [number, number],
  duration: number,
  transportMode: TransportMode
): Promise<any> => {
  const token = getMapboxToken();
  if (!token) {
    throw new Error('Token Mapbox manquant');
  }

  try {
    const profile = getMapboxProfile(transportMode);
    const url = `${MAPBOX_CONFIG.isochrone.endpoint}/${profile}/${center[0]},${center[1]}`;
    
    const response = await fetch(`${url}?contours_minutes=${duration}&access_token=${token}`);
    if (!response.ok) {
      throw new Error(`Erreur API Isochrone: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la création d\'isochrone:', error);
    throw error;
  }
};
