
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types/map';
import { SearchResult } from '@/types/geosearch';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

// Mapbox profile mapping
const getMapboxProfile = (transportMode: TransportMode): string => {
  const profileMap: Record<TransportMode, string> = {
    driving: 'driving',
    walking: 'walking',
    cycling: 'cycling',
    bus: 'walking', // Fallback to walking for transit
    train: 'walking',
    transit: 'walking'
  };
  
  return profileMap[transportMode] || 'walking';
};

interface SearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}

interface MapboxPlace {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties?: {
    category?: string;
    address?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export const enhancedMapboxService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 5, radius = 10 } = options;
      
      const bbox = this.calculateBoundingBox(center, radius);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address&` +
        `autocomplete=true&` +
        `bbox=${bbox.join(',')}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
    } catch (error) {
      console.error('Enhanced Mapbox search error:', error);
      // Return mock data as fallback
      return this.getMockResults(center);
    }
  },

  convertToSearchResult(feature: MapboxPlace, center: [number, number]): SearchResult {
    const distance = this.calculateDistance(center, feature.center);
    
    return {
      id: feature.id,
      name: feature.text,
      address: feature.place_name,
      coordinates: feature.center,
      type: 'place',
      category: feature.properties?.category || 'restaurant',
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance * 12) // Estimation: 5 km/h walking speed
    };
  },

  calculateDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  calculateBoundingBox([lng, lat]: [number, number], radiusKm: number): [number, number, number, number] {
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));

    return [
      lng - lngDelta, // west
      lat - latDelta, // south
      lng + lngDelta, // east
      lat + latDelta  // north
    ];
  },

  getMockResults(center: [number, number]): SearchResult[] {
    return [
      {
        id: 'mock-1',
        name: 'Restaurant Local',
        address: 'Adresse exemple',
        coordinates: [center[0] + 0.001, center[1] + 0.001],
        type: 'restaurant',
        category: 'restaurant',
        distance: 0.1,
        duration: 2
      }
    ];
  }
};
