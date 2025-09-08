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
      const { limit = 10, types = ['poi'], language = 'fr' } = options; // Retirer country pour expansion
      const token = await getMapboxToken();
      
      if (!token) throw new Error('Token Mapbox non disponible');

      // URL avec paramètres optimisés pour POI sans contrainte géographique
      let url = `https://api.mapbox.com/search/searchbox/v1/suggest?` +
        `q=${encodeURIComponent(query)}&` +
        `access_token=${token}&` +
        `language=${language}&` +
        `limit=${limit}&` +
        `types=${types.join(',')}`;
        // Retirer country pour permettre expansion géographique automatique

      // Ajouter proximity si disponible (pour prioriser mais pas limiter)
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
   * Recherche POI optimisée avec Search Box API - Flux complet
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
      console.log('🔍 SearchBox POI - Recherche optimisée:', { query, center, options });
      
      const { limit = 10, radius = 50, categories } = options;
      const validLimit = Math.min(limit, 10); // Mapbox Search Box limite à 10
      
      // Types optimisés selon la requête pour meilleurs POI
      const types = this.getOptimalPOITypes(query, categories);
      
      // 1. Recherche prioritaire avec types optimisés (sans contrainte géographique)
      let suggestions = await this.getSuggestions(query, center, {
        limit: validLimit,
        types,
        language: 'fr'
      });
      
      console.log('🎯 SearchBox - Suggestions trouvées:', suggestions.length, 'avec types:', types);
      
      // 2. Fallback progressif si pas assez de résultats
      if (suggestions.length < Math.min(3, validLimit)) {
        console.log('🔄 SearchBox - Expansion recherche...');
        
        // Essayer avec types plus larges
        const fallbackSuggestions = await this.getSuggestions(query, center, {
          limit: validLimit,
          types: ['poi', 'poi.business', 'address', 'place'],
          language: 'fr'
        });
        
        // Merger sans doublons
        const existingIds = new Set(suggestions.map(s => s.mapbox_id));
        const newSuggestions = fallbackSuggestions.filter(s => !existingIds.has(s.mapbox_id));
        suggestions.push(...newSuggestions);
        
        console.log('📈 Expansion résultats:', suggestions.length);
      }
      
      // 3. Fallback ultime si toujours pas de résultats
      if (suggestions.length === 0) {
        console.log('🆘 Fallback vers ancienne API...');
        return await this.fallbackSearch(query, center, validLimit);
      }
      
      // 4. Convertir suggestions → features complètes avec coordonnées
      const searchResults: SearchResult[] = [];
      const processPromises = suggestions.slice(0, validLimit).map(async (suggestion) => {
        try {
          const feature = await this.retrieveFeature(suggestion.mapbox_id);
          if (feature && feature.geometry && feature.geometry.coordinates) {
            const result = this.convertToSearchResult(feature, center, suggestion);
            return result;
          } else {
            console.warn('⚠️ Feature sans coordonnées:', suggestion.mapbox_id);
            return null;
          }
        } catch (error) {
          console.warn('⚠️ Erreur récupération feature:', suggestion.mapbox_id, error);
          return null;
        }
      });
      
      // Attendre toutes les conversions en parallèle
      const results = await Promise.all(processPromises);
      const validResults = results.filter((result): result is SearchResult => result !== null);
      
      console.log('✅ SearchBox POI - Résultats avec coordonnées:', validResults.length, '/', suggestions.length);
      return validResults;
      
    } catch (error) {
      console.error('❌ SearchBox POI Error:', error);
      return await this.fallbackSearch(query, center, Math.min(options.limit || 10, 10));
    }
  },

  /**
   * Détermine les types POI optimaux selon la requête - Spécialisé établissements
   */
  getOptimalPOITypes(query: string, categories?: string[]): string[] {
    const queryLower = query.toLowerCase();
    
    // Types POI valides pour Mapbox Search Box API 2024
    const validTypes = ['poi', 'poi.business', 'address', 'place'];
    
    // Si des catégories sont spécifiées, filtrer seulement les types valides
    if (categories && categories.length > 0) {
      return categories.filter(cat => validTypes.includes(cat) || cat.startsWith('poi'));
    }
    
    // Mapping spécialisé pour établissements et marques
    if (queryLower.includes('ikea') || queryLower.includes('decathlon') || queryLower.includes('carrefour') || 
        queryLower.includes('leclerc') || queryLower.includes('auchan') || queryLower.includes('lidl')) {
      return ['poi.business', 'poi']; // Priorité commerce
    }
    
    if (queryLower.includes('mcdonald') || queryLower.includes('mcdo') || queryLower.includes('kfc') || 
        queryLower.includes('burger king') || queryLower.includes('quick')) {
      return ['poi.business', 'poi']; // Fast-food prioritaire
    }
    
    if (queryLower.includes('restaurant') || queryLower.includes('café') || queryLower.includes('bar') || 
        queryLower.includes('brasserie') || queryLower.includes('bistrot')) {
      return ['poi.business', 'poi'];
    }
    
    if (queryLower.includes('supermarché') || queryLower.includes('magasin') || queryLower.includes('shop') || 
        queryLower.includes('commerce') || queryLower.includes('boutique')) {
      return ['poi.business', 'poi'];
    }
    
    if (queryLower.includes('pharmacie') || queryLower.includes('hôpital') || queryLower.includes('médecin') || 
        queryLower.includes('clinique') || queryLower.includes('cabinet')) {
      return ['poi.business', 'poi'];
    }
    
    if (queryLower.includes('station') || queryLower.includes('essence') || queryLower.includes('carburant') || 
        queryLower.includes('total') || queryLower.includes('shell') || queryLower.includes('bp')) {
      return ['poi.business', 'poi'];
    }
    
    if (queryLower.includes('banque') || queryLower.includes('crédit') || queryLower.includes('bnp') || 
        queryLower.includes('société générale') || queryLower.includes('lcl')) {
      return ['poi.business', 'poi'];
    }
    
    // Par défaut, tous types POI pour capture large
    return ['poi', 'poi.business'];
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
   * Inférence de catégorie intelligente pour établissements
   */
  inferCategory(name: string): string {
    const lowerName = name.toLowerCase();
    
    // Grandes marques et enseignes
    if (lowerName.includes('ikea') || lowerName.includes('decathlon') || lowerName.includes('carrefour') || 
        lowerName.includes('leclerc') || lowerName.includes('auchan') || lowerName.includes('lidl') || 
        lowerName.includes('magasin') || lowerName.includes('commerce') || lowerName.includes('boutique')) {
      return 'shopping';
    }
    
    // Restauration
    if (lowerName.includes('mcdonald') || lowerName.includes('mcdo') || lowerName.includes('kfc') || 
        lowerName.includes('burger king') || lowerName.includes('quick') || lowerName.includes('restaurant') || 
        lowerName.includes('café') || lowerName.includes('bar') || lowerName.includes('brasserie')) {
      return 'restaurant';
    }
    
    // Santé
    if (lowerName.includes('pharmacie') || lowerName.includes('hôpital') || lowerName.includes('médecin') || 
        lowerName.includes('clinique') || lowerName.includes('cabinet')) {
      return 'health';
    }
    
    // Services financiers
    if (lowerName.includes('banque') || lowerName.includes('crédit') || lowerName.includes('bnp') || 
        lowerName.includes('société générale') || lowerName.includes('lcl')) {
      return 'finance';
    }
    
    // Stations service
    if (lowerName.includes('station') || lowerName.includes('essence') || lowerName.includes('carburant') || 
        lowerName.includes('total') || lowerName.includes('shell') || lowerName.includes('bp')) {
      return 'fuel';
    }
    
    // Hébergement
    if (lowerName.includes('hôtel') || lowerName.includes('auberge') || lowerName.includes('camping')) {
      return 'lodging';
    }
    
    // Loisirs
    if (lowerName.includes('parc') || lowerName.includes('cinéma') || lowerName.includes('théâtre')) {
      return 'entertainment';
    }
    
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