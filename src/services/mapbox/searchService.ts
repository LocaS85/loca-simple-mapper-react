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

import { getMapboxToken } from '@/utils/mapboxConfig';

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
      
      // Recherche spécifique pour IKEA et grandes marques
      if (enhancedQuery.toLowerCase().includes('ikea')) {
        console.log('🔍 Recherche spécifique IKEA');
        const ikeaResults = await this.searchSpecificBrand('IKEA', center, limit);
        if (ikeaResults.length > 0) {
          console.log('📍 Résultats IKEA trouvés:', ikeaResults.length);
          return ikeaResults;
        }
        // Si pas trouvé, rechercher "mobilier" ou "furniture store"
        const furnitureResults = await this.searchWithGenericTerms(['mobilier', 'furniture store', 'magasin meuble'], center, limit);
        if (furnitureResults.length > 0) {
          return furnitureResults;
        }
      }
      
      // Recherche générale améliorée avec logging
      if (!enhancedQuery || enhancedQuery.length < 2) {
        enhancedQuery = 'restaurant commerce magasin';
      }

      console.log('🔍 Recherche Mapbox générale:', { query: enhancedQuery, center, options });

      // Recherche principale sans bbox pour une couverture plus large
      const token = await getMapboxToken();
      console.log('🔑 Token Mapbox disponible:', !!token);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(enhancedQuery)}.json?` +
        `access_token=${token}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,poi.business,poi.landmark,place,address&` +
        `autocomplete=true`;

      console.log('📡 URL de recherche:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur API Mapbox:', response.status, response.statusText);
        return this.getFallbackResults(enhancedQuery, center);
      }

      const data = await response.json();
      console.log('📊 Réponse Mapbox:', { 
        features: data.features?.length || 0, 
        query: enhancedQuery,
        hasResults: !!data.features?.length 
      });
      
      if (!data.features || data.features.length === 0) {
        console.log('🔄 Aucun résultat, utilisation fallback...');
        return this.getFallbackResults(enhancedQuery, center);
      }
      
      const results = data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
      console.log('✅ Résultats finaux:', results);
      return results;
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      return this.getFallbackResults(query, center);
    }
  },

  async searchWithGenericTerms(
    terms: string[],
    center: [number, number], 
    limit: number = 10
  ): Promise<SearchResult[]> {
    for (const term of terms) {
      try {
        console.log(`🔍 Recherche générique: "${term}"`);
        const token = await getMapboxToken();
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
          `access_token=${token}&` +
          `proximity=${center[0]},${center[1]}&` +
          `limit=${limit}&` +
          `country=fr&` +
          `language=fr&` +
          `types=poi,poi.business,place&` +
          `autocomplete=true`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          console.log(`✅ Trouvé ${data.features.length} résultats pour "${term}"`);
          return data.features.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center));
        }
      } catch (error) {
        console.log(`❌ Erreur recherche générique "${term}":`, error);
      }
    }
    
    return [];
  },

  getFallbackResults(query: string, center: [number, number]): SearchResult[] {
    console.log('🔄 Génération de résultats fallback pour:', query);
    
    // Résultats fallback basés sur le type de recherche
    const fallbackResults: SearchResult[] = [];
    const distance = Math.random() * 5 + 0.5; // Distance entre 0.5 et 5.5 km
    
    if (query.toLowerCase().includes('ikea')) {
      fallbackResults.push({
        id: 'fallback-ikea-1',
        name: 'IKEA (Recherche élargie nécessaire)',
        address: 'Aucun magasin IKEA trouvé dans cette zone. Essayez une recherche plus large ou "mobilier".',
        coordinates: [center[0] + 0.01, center[1] + 0.01],
        type: 'place',
        category: 'shopping',
        distance: distance,
        duration: Math.round(distance * 12)
      });
    } else if (query.toLowerCase().includes('restaurant')) {
      fallbackResults.push(
        {
          id: 'fallback-restaurant-1',
          name: 'Restaurant Local',
          address: 'Restaurant de proximité (données limitées)',
          coordinates: [center[0] + 0.001, center[1] + 0.001],
          type: 'restaurant',
          category: 'restaurant',
          distance: distance,
          duration: Math.round(distance * 15)
        },
        {
          id: 'fallback-restaurant-2',
          name: 'Brasserie du Coin',
          address: 'Cuisine traditionnelle (données limitées)',
          coordinates: [center[0] - 0.002, center[1] + 0.003],
          type: 'restaurant',
          category: 'restaurant',
          distance: distance + 0.5,
          duration: Math.round((distance + 0.5) * 15)
        }
      );
    }
    
    return fallbackResults;
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
        const token = await getMapboxToken();
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?` +
          `access_token=${token}&` +
          `proximity=${center[0]},${center[1]}&` +
          `limit=${limit}&` +
          `country=fr&` +
          `language=fr&` +
          `types=poi,poi.business,poi.landmark,place&` +
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
      
      console.log('🔄 Recherche fallback sans bbox:', { query, center });
      
      const token = await getMapboxToken();
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${token}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,poi.business,poi.landmark,place,address&` +
        `autocomplete=true`;

      console.log('📡 URL fallback:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur API fallback:', response.status);
        return this.getFallbackResults(query, center);
      }
      
      const data = await response.json();
      console.log('📊 Résultats fallback:', data.features?.length || 0);
      
      const results = data.features?.map((feature: MapboxPlace) => this.convertToSearchResult(feature, center)) || [];
      console.log('✅ Résultats fallback convertis:', results);
      
      return results;
    } catch (error) {
      console.error('❌ Erreur recherche fallback:', error);
      return this.getFallbackResults(query, center);
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