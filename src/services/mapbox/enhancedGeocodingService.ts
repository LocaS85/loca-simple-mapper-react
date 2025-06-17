
import { getMapboxToken } from '@/utils/mapboxConfig';
import { SearchResult } from '@/types/geosearch';

interface GeocodingOptions {
  limit?: number;
  radius?: number;
  language?: string;
  categories?: string[];
}

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties?: {
    category?: string;
    address?: string;
    foursquare?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export const enhancedGeocodingService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: GeocodingOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 5, radius = 10, language = 'fr' } = options;
      const token = getMapboxToken();
      
      if (!token) {
        throw new Error('Token Mapbox manquant');
      }

      const bbox = this.calculateBoundingBox(center, radius);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${token}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=${language}&` +
        `types=poi,place,address&` +
        `bbox=${bbox.join(',')}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.features || !Array.isArray(data.features)) {
        return [];
      }

      return data.features.map((feature: MapboxFeature) => ({
        id: feature.id,
        name: feature.text,
        address: feature.place_name,
        coordinates: feature.center,
        type: 'place',
        category: feature.properties?.category || this.extractCategoryFromContext(feature) || 'place',
        distance: this.calculateDistance(center, feature.center)
      }));
    } catch (error) {
      console.error('Enhanced geocoding error:', error);
      return [];
    }
  },

  extractCategoryFromContext(feature: MapboxFeature): string | null {
    // Essayer d'extraire la catégorie du contexte
    if (feature.context) {
      for (const ctx of feature.context) {
        if (ctx.id.includes('poi')) {
          return 'restaurant';
        }
        if (ctx.id.includes('address')) {
          return 'place';
        }
      }
    }
    
    // Extraire de properties si disponible
    if (feature.properties?.foursquare) {
      return 'restaurant';
    }
    
    return null;
  },

  calculateDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  },

  calculateBoundingBox([lng, lat]: [number, number], radiusKm: number): [number, number, number, number] {
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));

    return [
      lng - lngDelta,
      lat - latDelta,
      lng + lngDelta,
      lat + latDelta
    ];
  }
};
