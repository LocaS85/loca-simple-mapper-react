
import { SearchResult } from '@/types/geosearch';

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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

export const mapboxSearchService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10, radius = 100 } = options;
      
      // Améliorer la requête pour les marques spécifiques
      let enhancedQuery = query.trim();
      
      if (enhancedQuery.toLowerCase().includes('ikea')) {
        const ikeaResults = await this.searchSpecificBrand('IKEA', center, limit);
        if (ikeaResults.length > 0) {
          console.log('📍 Résultats IKEA trouvés:', ikeaResults.length);
          return ikeaResults;
        }
      }
      
      // Recherche générale améliorée
      if (!enhancedQuery || enhancedQuery.length < 2) {
        enhancedQuery = 'restaurant commerce magasin';
      }

      // Recherche principale avec bbox élargie
      const bbox = this.calculateBoundingBox(center, radius);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(enhancedQuery)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address,place&` +
        `autocomplete=true&` +
        `bbox=${bbox.join(',')}`;

      console.log('🔍 Recherche URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur API Mapbox: ${response.status}`);
      }

      const data = await response.json();
      console.log('📍 Résultats Mapbox:', data.features?.length || 0);
      
      if (!data.features || data.features.length === 0) {
        console.log('🔄 Recherche fallback sans bbox...');
        return this.searchWithoutBbox(enhancedQuery, center, options);
      }
      
      return data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      throw error;
    }
  },

  async searchSpecificBrand(
    brand: string,
    center: [number, number],
    limit: number = 5
  ): Promise<SearchResult[]> {
    const searches = [
      `${brand} magasin`,
      `${brand} store`,
      brand,
      `${brand} meuble`,
      `${brand} furniture`
    ];

    for (const searchTerm of searches) {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `proximity=${center[0]},${center[1]}&` +
          `limit=${limit}&` +
          `country=fr&` +
          `language=fr&` +
          `types=poi,place&` +
          `autocomplete=true`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          console.log(`✅ Trouvé ${data.features.length} résultats pour "${searchTerm}"`);
          return data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
        }
      } catch (error) {
        console.log(`❌ Erreur recherche "${searchTerm}":`, error);
      }
    }
    
    return [];
  },

  async searchWithoutBbox(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10 } = options;
      
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
      
      return data.features?.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center)) || [];
    } catch (error) {
      console.error('❌ Erreur recherche fallback:', error);
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
      duration: Math.round(distance * 12)
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
    const R = 6371;
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
      lng - lngDelta,
      lat - latDelta,
      lng + lngDelta,
      lat + latDelta
    ];
  }
};
