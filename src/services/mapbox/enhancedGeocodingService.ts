import { SearchResult } from '@/types/geosearch';
import { searchBoxService } from './searchBoxService';
import { brandSearchService } from './brandSearchService';

interface GeocodingOptions {
  limit?: number;
  radius?: number;
  language?: string;
  categories?: string[];
}

export const enhancedGeocodingService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: GeocodingOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10, radius = 50 } = options;
      
      console.log('🚀 Enhanced Geocoding - Nouvelle recherche POI:', { query, center, options });
      
      // Priorité aux résultats de marques avec expansion géographique intelligente
      const brandResults = await brandSearchService.searchBrand(query, center, {
        limit,
        expandRadius: true,
        maxRadius: radius * 3 // Expansion plus large pour POI nationaux
      });
      
      if (brandResults.length > 0) {
        console.log('🏷️ Résultats marques trouvés avec expansion:', brandResults.length);
        return brandResults.slice(0, limit);
      }
      
      // Recherche POI standard avec Search Box API et expansion automatique
      console.log('🔍 Recherche POI avec expansion automatique...');
      const poiResults = await searchBoxService.searchPOI(query, center, {
        limit,
        radius: radius || 50, // Rayon élargi par défaut
        categories: options.categories || ['poi', 'poi.business', 'poi.shopping', 'poi.retail']
      });
      
      if (poiResults.length > 0) {
        console.log('📍 Résultats POI standard avec expansion trouvés:', poiResults.length);
        return poiResults;
      }
      
      // Fallback vers l'ancienne méthode
      console.log('🔄 Fallback vers méthode legacy...');
      return await this.legacySearch(query, center, options);
      
    } catch (error) {
      console.error('❌ Enhanced geocoding error:', error);
      return await this.legacySearch(query, center, options);
    }
  },

  /**
   * Recherche rapide pour l'autocomplétion
   */
  async getQuickSuggestions(
    query: string,
    center: [number, number],
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      // Priorité aux marques pour l'autocomplétion
      const brandSuggestions = await brandSearchService.getQuickSuggestions(query, center, limit);
      
      if (brandSuggestions.length > 0) {
        return brandSuggestions;
      }
      
      // Suggestions POI standard
      return await searchBoxService.getSuggestions(query, center, { limit })
        .then(suggestions => suggestions.map(suggestion => ({
          id: suggestion.mapbox_id,
          name: suggestion.text,
          address: this.buildAddressFromSuggestion(suggestion),
          coordinates: center, // Coordonnées temporaires
          type: suggestion.feature_type,
          category: suggestion.metadata?.category || this.inferCategoryFromName(suggestion.text),
          distance: 0,
          duration: 0
        })));
        
    } catch (error) {
      console.error('❌ Erreur suggestions rapides:', error);
      return [];
    }
  },

  /**
   * Méthode legacy pour compatibilité
   */
  async legacySearch(
    query: string,
    center: [number, number],
    options: GeocodingOptions = {}
  ): Promise<SearchResult[]> {
    console.log('🔄 Utilisation méthode legacy');
    
    // Fallback vers l'ancienne API Geocoding
    return await searchBoxService.fallbackSearch(query, center, options.limit || 10);
  },

  buildAddressFromSuggestion(suggestion: any): string {
    const parts = [];
    if (suggestion.context?.place?.name) parts.push(suggestion.context.place.name);
    if (suggestion.context?.region?.name) parts.push(suggestion.context.region.name);
    return parts.join(', ') || 'Lieu à préciser';
  },

  extractCategoryFromContext(result: SearchResult): string | null {
    const placeName = result.address?.toLowerCase() || result.name?.toLowerCase() || '';
    return this.inferCategoryFromName(placeName);
  },

  inferCategoryFromName(placeName: string): string | null {
    if (placeName.includes('ikea') || placeName.includes('meuble')) return 'shopping';
    if (placeName.includes('restaurant') || placeName.includes('café')) return 'restaurant';
    if (placeName.includes('pharmacie')) return 'health';
    if (placeName.includes('supermarché') || placeName.includes('magasin')) return 'shopping';
    if (placeName.includes('hôtel')) return 'lodging';
    if (placeName.includes('parc')) return 'park';
    return 'place';
  },

  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    return searchBoxService.calculateDistance(coord1, coord2);
  },

  calculateBoundingBox(center: [number, number], radiusKm: number): [number, number, number, number] {
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos(center[1] * Math.PI / 180));
    return [
      center[0] - lngDelta,
      center[1] - latDelta,
      center[0] + lngDelta,
      center[1] + latDelta
    ];
  }
};