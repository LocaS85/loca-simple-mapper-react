import { SearchResult } from '@/types/geosearch';
import { getMapboxToken } from '@/utils/mapboxConfig';

interface SearchBoxSuggestion {
  text: string;
  mapbox_id: string;
  feature_type: string;
  context?: {
    country?: { name: string; country_code: string };
    region?: { name: string; region_code: string };
    place?: { name: string };
  };
  metadata?: {
    primary_photo?: string[];
    phone?: string;
    website?: string;
    category?: string;
  };
}

interface SearchBoxFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    name: string;
    address?: string;
    category?: string;
    maki?: string;
    phone?: string;
    website?: string;
  };
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export const searchBoxService = {
  /**
   * Nouvelle API Search Box - Étape 1: Suggestions
   */
  async getSuggestions(
    query: string,
    proximity?: [number, number],
    options: {
      limit?: number;
      types?: string[];
      language?: string;
      country?: string;
    } = {}
  ): Promise<SearchBoxSuggestion[]> {
    try {
      const { limit = 10, types = ['poi'], language = 'fr', country = 'fr' } = options;
      const token = await getMapboxToken();
      
      if (!token) throw new Error('Token Mapbox non disponible');

      // URL avec paramètres optimisés pour POI
      let url = `https://api.mapbox.com/search/searchbox/v1/suggest?` +
        `q=${encodeURIComponent(query)}&` +
        `access_token=${token}&` +
        `language=${language}&` +
        `limit=${limit}&` +
        `country=${country}&` +
        `types=${types.join(',')}`;

      // Ajouter proximity si disponible
      if (proximity) {
        url += `&proximity=${proximity[0]},${proximity[1]}`;
      }

      console.log('🔍 Search Box API - Suggestions:', { query, url: url.replace(token, 'HIDDEN') });

      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur Search Box API:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Suggestions reçues:', data.suggestions?.length || 0);
      
      return data.suggestions || [];
    } catch (error) {
      console.error('❌ Erreur getSuggestions:', error);
      return [];
    }
  },

  /**
   * Nouvelle API Search Box - Étape 2: Récupération des détails
   */
  async retrieveFeature(mapboxId: string): Promise<SearchBoxFeature | null> {
    try {
      const token = await getMapboxToken();
      if (!token) throw new Error('Token Mapbox non disponible');

      const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?` +
        `access_token=${token}`;

      console.log('📍 Récupération détails:', mapboxId);

      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur retrieve:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('📍 Détails récupérés:', data.features?.[0]?.properties?.name);
      
      return data.features?.[0] || null;
    } catch (error) {
      console.error('❌ Erreur retrieveFeature:', error);
      return null;
    }
  },

  /**
   * Recherche POI optimisée avec Search Box API
   */
  async searchPOI(
    query: string,
    center: [number, number],
    options: {
      limit?: number;
      radius?: number;
      categories?: string[];
    } = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10, categories } = options;
      
      // Déterminer les types POI selon la requête
      const types = this.getOptimalPOITypes(query, categories);
      
      console.log('🎯 Recherche POI optimisée:', { query, types, center });

      // Étape 1: Obtenir les suggestions
      const suggestions = await this.getSuggestions(query, center, {
        limit,
        types,
        language: 'fr',
        country: 'fr'
      });

      if (suggestions.length === 0) {
        console.log('🔄 Pas de suggestions, recherche élargie...');
        return await this.fallbackSearch(query, center, limit);
      }

      // Étape 2: Récupérer les détails pour chaque suggestion
      const results: SearchResult[] = [];
      
      for (const suggestion of suggestions.slice(0, limit)) {
        try {
          const feature = await this.retrieveFeature(suggestion.mapbox_id);
          if (feature) {
            const searchResult = this.convertToSearchResult(feature, center, suggestion);
            results.push(searchResult);
          }
        } catch (error) {
          console.error('❌ Erreur récupération détail:', error);
        }
      }

      console.log('✅ Résultats POI finaux:', results.length);
      return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
    } catch (error) {
      console.error('❌ Erreur searchPOI:', error);
      return await this.fallbackSearch(query, center, options.limit || 10);
    }
  },

  /**
   * Détermine les types POI optimaux selon la requête
   */
  getOptimalPOITypes(query: string, categories?: string[]): string[] {
    const lowerQuery = query.toLowerCase();
    
    // Types spécifiques selon les marques/catégories
    if (lowerQuery.includes('ikea') || lowerQuery.includes('meuble')) {
      return ['poi', 'poi.business', 'poi.shopping'];
    }
    
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('café')) {
      return ['poi', 'poi.business', 'poi.food_and_beverage'];
    }
    
    if (lowerQuery.includes('pharmacie') || lowerQuery.includes('médecin')) {
      return ['poi', 'poi.business', 'poi.medical'];
    }
    
    if (lowerQuery.includes('supermarché') || lowerQuery.includes('magasin')) {
      return ['poi', 'poi.business', 'poi.shopping'];
    }
    
    if (lowerQuery.includes('hôtel') || lowerQuery.includes('hébergement')) {
      return ['poi', 'poi.business', 'poi.lodging'];
    }

    // Types par défaut pour une recherche large
    return ['poi', 'poi.business', 'poi.landmark'];
  },

  /**
   * Recherche de fallback avec l'ancienne API
   */
  async fallbackSearch(query: string, center: [number, number], limit: number): Promise<SearchResult[]> {
    try {
      console.log('🔄 Fallback vers ancienne API Geocoding');
      
      const token = await getMapboxToken();
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${token}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,poi.business,poi.landmark,place`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features) {
        return data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          address: feature.place_name,
          coordinates: feature.center,
          type: 'place',
          category: this.inferCategory(feature.place_name),
          distance: this.calculateDistance(center, feature.center),
          duration: Math.round(this.calculateDistance(center, feature.center) * 12)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Erreur fallback:', error);
      return [];
    }
  },

  /**
   * Convertit une feature Search Box en SearchResult
   */
  convertToSearchResult(
    feature: SearchBoxFeature, 
    center: [number, number], 
    suggestion: SearchBoxSuggestion
  ): SearchResult {
    const distance = this.calculateDistance(center, feature.geometry.coordinates);
    
    return {
      id: feature.id,
      name: feature.properties.name || suggestion.text,
      address: this.buildAddress(feature, suggestion),
      coordinates: feature.geometry.coordinates,
      type: feature.place_type[0] || 'place',
      category: feature.properties.category || this.inferCategory(feature.properties.name),
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance * 12), // 12 min/km à pied
      phone: feature.properties.phone,
      website: feature.properties.website
    };
  },

  /**
   * Construit l'adresse complète
   */
  buildAddress(feature: SearchBoxFeature, suggestion: SearchBoxSuggestion): string {
    if (feature.properties.address) {
      return feature.properties.address;
    }
    
    const parts = [];
    if (suggestion.context?.place?.name) parts.push(suggestion.context.place.name);
    if (suggestion.context?.region?.name) parts.push(suggestion.context.region.name);
    if (suggestion.context?.country?.name) parts.push(suggestion.context.country.name);
    
    return parts.join(', ') || 'Adresse non disponible';
  },

  /**
   * Inférence de catégorie
   */
  inferCategory(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ikea') || lowerName.includes('meuble')) return 'shopping';
    if (lowerName.includes('restaurant') || lowerName.includes('café')) return 'restaurant';
    if (lowerName.includes('pharmacie')) return 'health';
    if (lowerName.includes('magasin') || lowerName.includes('commerce')) return 'shopping';
    if (lowerName.includes('hôtel')) return 'lodging';
    if (lowerName.includes('parc')) return 'park';
    return 'place';
  },

  /**
   * Calcul de distance
   */
  calculateDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
};