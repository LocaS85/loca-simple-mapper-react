
import { SearchResult } from '@/types/geosearch';
import { searchBoxService } from './searchBoxService';
import { brandSearchService } from './brandSearchService';
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
      console.log('🚀 Enhanced Mapbox Service - Nouvelle architecture POI');
      
      // Priorité à la recherche de marques
      const brandResults = await brandSearchService.searchBrand(query, center, {
        limit: options.limit,
        expandRadius: true,
        maxRadius: (options.radius || 50) * 2
      });
      
      if (brandResults.length > 0) {
        console.log('✅ Résultats marques Enhanced Mapbox:', brandResults.length);
        return brandResults;
      }
      
      // Recherche POI standard avec Search Box API
      const poiResults = await searchBoxService.searchPOI(query, center, options);
      
      if (poiResults.length > 0) {
        console.log('✅ Résultats POI Enhanced Mapbox:', poiResults.length);
        return poiResults;
      }
      
      // Fallback vers données simulées
      console.log('🔄 Fallback vers données simulées');
      return mockDataService.getMockResults(center, query);
      
    } catch (error) {
      console.error('❌ Erreur Enhanced Mapbox Service:', error);
      return mockDataService.getMockResults(center, query);
    }
  }
};
