
import { SearchResult } from '@/types/geosearch';
import { enhancedGeocodingService } from './enhancedGeocodingService';
import { mockDataService } from './mockDataService';

interface SearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}

export const enhancedMapboxService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      console.log('🚀 Enhanced Mapbox Service - Architecture POI unifiée avec expansion automatique');
      
      // Utiliser le service unifié qui gère marques + Search Box API + expansion
      const results = await enhancedGeocodingService.searchPlaces(query, center, {
        limit: options.limit || 10,
        radius: options.radius || 50, // Rayon élargi par défaut
        categories: options.categories || ['poi', 'poi.business', 'poi.shopping', 'poi.retail']
      });
      
      if (results.length > 0) {
        console.log('✅ Architecture POI unifiée - Résultats trouvés:', results.length);
        return results;
      }
      
      // Fallback final vers données simulées (rare)
      console.log('🔄 Fallback final vers données simulées');
      return mockDataService.getMockResults(center, query);
      
    } catch (error) {
      console.error('❌ Erreur Enhanced Mapbox Service unifié:', error);
      return mockDataService.getMockResults(center, query);
    }
  },

  // Méthode pour l'autocomplétion rapide
  async getQuickSuggestions(
    query: string,
    center: [number, number],
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      return await enhancedGeocodingService.getQuickSuggestions(query, center, limit);
    } catch (error) {
      console.error('❌ Erreur suggestions rapides:', error);
      return [];
    }
  }
};
