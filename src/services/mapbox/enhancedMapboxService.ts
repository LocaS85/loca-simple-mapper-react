
import { SearchResult } from '@/types/geosearch';
import { mapboxSearchService } from './searchService';
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
      return await mapboxSearchService.searchPlaces(query, center, options);
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      return mockDataService.getMockResults(center, query);
    }
  }
};
