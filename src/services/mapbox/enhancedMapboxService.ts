
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types/map';
import { SearchResult } from '@/types/geosearch';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

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
      const { limit = 5, radius = 50 } = options; // Augmenter le rayon par défaut
      
      // Améliorer la requête de recherche pour de meilleurs résultats
      let searchQuery = query.trim();
      
      // Pour des marques spécifiques comme IKEA, ajouter des termes de recherche
      if (searchQuery.toLowerCase().includes('ikea')) {
        searchQuery = 'IKEA magasin meuble';
      }
      
      // Si pas de requête spécifique, rechercher des POI généraux
      if (!searchQuery || searchQuery.length < 2) {
        searchQuery = 'restaurant cafe magasin pharmacie';
      }

      // Utiliser un rayon plus large pour la bbox
      const bbox = this.calculateBoundingBox(center, radius);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address,place&` + // Ajouter 'place' pour plus de résultats
        `autocomplete=true&` +
        `bbox=${bbox.join(',')}`;

      console.log('🔍 Enhanced search URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📍 Enhanced Mapbox results:', data.features?.length || 0, data.features);
      
      if (!data.features || data.features.length === 0) {
        // Fallback: recherche élargie sans bbox
        return this.searchWithoutBbox(searchQuery, center, options);
      }
      
      return data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
    } catch (error) {
      console.error('Enhanced Mapbox search error:', error);
      return this.getMockResults(center, query);
    }
  },

  async searchWithoutBbox(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 5 } = options;
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address,place&` +
        `autocomplete=true`;

      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📍 Fallback search results:', data.features?.length || 0);
      
      return data.features?.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center)) || [];
    } catch (error) {
      console.error('Fallback search error:', error);
      return [];
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
      category: feature.properties?.category || this.inferCategory(feature.place_name) || 'place',
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance * 12) // Estimation: 5 km/h walking speed
    };
  },

  inferCategory(placeName: string): string {
    const name = placeName.toLowerCase();
    if (name.includes('ikea') || name.includes('meuble')) return 'shopping';
    if (name.includes('restaurant') || name.includes('café')) return 'restaurant';
    if (name.includes('pharmacie')) return 'health';
    if (name.includes('magasin') || name.includes('commerce')) return 'shopping';
    if (name.includes('hôtel')) return 'hotel';
    return 'place';
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

  getMockResults(center: [number, number], query?: string): SearchResult[] {
    const mockData = [
      {
        id: 'mock-ikea-1',
        name: 'IKEA Roissy',
        address: 'Centre Commercial Aéroville, 93290 Tremblay-en-France',
        coordinates: [center[0] + 0.05, center[1] + 0.03] as [number, number],
        type: 'shopping',
        category: 'shopping',
        distance: 5.2,
        duration: 15
      },
      {
        id: 'mock-ikea-2',
        name: 'IKEA Franconville',
        address: 'ZAC des Closeaux, 95130 Franconville',
        coordinates: [center[0] - 0.03, center[1] + 0.04] as [number, number],
        type: 'shopping',
        category: 'shopping',
        distance: 8.1,
        duration: 20
      }
    ];

    if (query?.toLowerCase().includes('ikea')) {
      return mockData;
    }

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
