
import { getMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';
import { captureMapboxError } from './monitoring';

// Interface pour les paramètres de recherche avec filtres
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

// Interface pour les résultats de recherche
export interface FilterSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance: number;
  duration?: number;
  relevance?: number;
}

// Interface pour les directions
export interface DirectionResult {
  route: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
    instructions?: string[];
  };
}

// Interface pour les isochrones
export interface IsochroneResult {
  polygon: {
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][][];
    };
    properties: {
      fillColor: string;
      fillOpacity: number;
      fill: string;
      color: string;
    };
  };
}

// Mapping des modes de transport Mapbox
const getMapboxProfile = (transportMode: TransportMode): string => {
  const profileMap: Record<TransportMode, string> = {
    'car': 'driving',
    'walking': 'walking',
    'cycling': 'cycling',
    'bus': 'driving', // Fallback pour bus
    'train': 'driving' // Fallback pour train
  };
  
  return profileMap[transportMode] || 'driving';
};

// Recherche de lieux avec filtres avancés
export const searchPlacesWithFilters = async (params: FilterSearchParams): Promise<FilterSearchResult[]> => {
  const token = getMapboxToken();
  
  try {
    // Construire la requête de base
    let query = params.query || '';
    if (params.category && !query) {
      query = params.category;
    }
    if (params.subcategory) {
      query = `${query} ${params.subcategory}`.trim();
    }
    
    if (!query) {
      query = 'point of interest'; // Requête par défaut
    }
    
    // Paramètres de la requête Geocoding API
    const searchParams = new URLSearchParams({
      access_token: token,
      proximity: params.center.join(','),
      limit: (params.limit || 10).toString(),
      country: 'fr',
      language: 'fr'
    });
    
    // Ajouter un rayon de recherche si spécifié
    if (params.radius) {
      const bbox = calculateBbox(params.center, params.radius, params.unit);
      searchParams.append('bbox', bbox.join(','));
    }
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;
    
    console.log('Mapbox Geocoding request with updated token:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      console.log('No results found for query:', query);
      return [];
    }
    
    // Traiter les résultats
    const results: FilterSearchResult[] = await Promise.all(
      data.features.map(async (feature: any, index: number) => {
        const coordinates: [number, number] = feature.center;
        const distance = calculateDistance(params.center, coordinates, params.unit);
        
        // Calculer la durée si possible
        let duration: number | undefined;
        if (params.maxDuration) {
          try {
            const directions = await getDirectionsWithFilters(
              params.center,
              coordinates,
              params.transportMode
            );
            duration = directions.route.duration;
            
            // Filtrer par durée maximale
            if (duration > params.maxDuration * 60) {
              return null;
            }
          } catch (error) {
            console.warn('Could not calculate duration for', feature.place_name);
          }
        }
        
        return {
          id: feature.id || `result-${index}`,
          name: feature.text || feature.place_name,
          address: feature.place_name,
          coordinates,
          category: determineCategory(feature),
          distance: Math.round(distance * 10) / 10,
          duration: duration ? Math.round(duration / 60) : undefined,
          relevance: feature.relevance
        };
      })
    );
    
    // Filtrer les résultats nulls et trier par pertinence/distance
    return results
      .filter(result => result !== null)
      .sort((a, b) => {
        if (a.relevance && b.relevance) {
          return b.relevance - a.relevance;
        }
        return a.distance - b.distance;
      }) as FilterSearchResult[];
    
  } catch (error) {
    console.error('Error in searchPlacesWithFilters:', error);
    captureMapboxError(error as Error, {
      apiCall: 'geocoding/search',
      params,
      userLocation: params.center
    });
    throw error;
  }
};

// Obtenir des directions avec filtres
export const getDirectionsWithFilters = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: TransportMode
): Promise<DirectionResult> => {
  const token = getMapboxToken();
  const profile = getMapboxProfile(transportMode);
  
  try {
    const coordinates = `${origin.join(',')};${destination.join(',')}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`;
    
    const params = new URLSearchParams({
      access_token: token,
      geometries: 'geojson',
      overview: 'full',
      steps: 'true'
    });
    
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Directions API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }
    
    const route = data.routes[0];
    
    return {
      route: {
        geometry: {
          coordinates: route.geometry.coordinates
        },
        distance: route.distance,
        duration: route.duration,
        instructions: route.legs?.[0]?.steps?.map((step: any) => step.maneuver?.instruction).filter(Boolean)
      }
    };
    
  } catch (error) {
    console.error('Error in getDirectionsWithFilters:', error);
    captureMapboxError(error as Error, {
      apiCall: 'directions',
      params: { origin, destination, transportMode }
    });
    throw error;
  }
};

// Créer une isochrone
export const createIsochrone = async (
  center: [number, number],
  duration: number,
  transportMode: TransportMode
): Promise<IsochroneResult> => {
  const token = getMapboxToken();
  const profile = getMapboxProfile(transportMode);
  
  try {
    const coordinates = center.join(',');
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coordinates}`;
    
    const params = new URLSearchParams({
      access_token: token,
      contours_minutes: duration.toString(),
      polygons: 'true'
    });
    
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Isochrone API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      throw new Error('No isochrone generated');
    }
    
    const feature = data.features[0];
    
    return {
      polygon: {
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          fill: '#3b82f6',
          color: '#1d4ed8'
        }
      }
    };
    
  } catch (error) {
    console.error('Error in createIsochrone:', error);
    captureMapboxError(error as Error, {
      apiCall: 'isochrone',
      params: { center, duration, transportMode }
    });
    throw error;
  }
};

// Fonctions utilitaires
const calculateDistance = (point1: [number, number], point2: [number, number], unit: 'km' | 'mi'): number => {
  const R = unit === 'km' ? 6371 : 3959; // Rayon de la Terre
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const calculateBbox = (center: [number, number], radius: number, unit: 'km' | 'mi'): [number, number, number, number] => {
  const radiusInDegrees = unit === 'km' ? radius / 111.32 : radius / 69.17;
  return [
    center[0] - radiusInDegrees,
    center[1] - radiusInDegrees,
    center[0] + radiusInDegrees,
    center[1] + radiusInDegrees
  ];
};

const determineCategory = (feature: any): string => {
  if (feature.properties?.category) {
    return feature.properties.category;
  }
  
  const placeType = feature.place_type?.[0];
  const categoryMap: Record<string, string> = {
    'poi': 'Point of Interest',
    'address': 'Address',
    'place': 'Place',
    'region': 'Region',
    'country': 'Country'
  };
  
  return categoryMap[placeType] || 'Unknown';
};
