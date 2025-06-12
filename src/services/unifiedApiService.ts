
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { TransportMode } from '@/types/map';
import { mapboxApiService } from './mapboxApiService';
import { enhancedMapboxService } from './mapbox/enhancedMapboxService';

export interface SearchPlace {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance?: number;
  duration?: number;
}

interface UnifiedSearchOptions {
  query: string;
  location: [number, number];
  filters: GeoSearchFilters;
}

export const unifiedApiService = {
  async search({ query, location, filters }: UnifiedSearchOptions): Promise<SearchResult[]> {
    try {
      console.log('🔍 Unified search:', { query, location, filters });

      // Utiliser le service enhanced en priorité
      const results = await enhancedMapboxService.searchPlaces(query, location, {
        limit: filters.aroundMeCount || 5,
        radius: filters.distance,
        categories: filters.category ? [filters.category] : undefined
      });

      console.log('✅ Unified search results:', results.length);
      return results;

    } catch (error) {
      console.error('❌ Unified search error:', error);
      
      // Fallback vers le service standard
      try {
        return await mapboxApiService.searchPlaces(query, location, {
          limit: filters.aroundMeCount || 5,
          radius: filters.distance
        });
      } catch (fallbackError) {
        console.error('❌ Fallback search error:', fallbackError);
        return this.getMockResults(location);
      }
    }
  },

  getMockResults(location: [number, number]): SearchResult[] {
    return [
      {
        id: 'mock-restaurant-1',
        name: 'Restaurant du Coin',
        address: '123 Rue de la Paix',
        coordinates: [location[0] + 0.001, location[1] + 0.001],
        type: 'restaurant',
        category: 'restaurant',
        distance: 0.2,
        duration: 3
      },
      {
        id: 'mock-cafe-1',
        name: 'Café Central',
        address: '45 Avenue des Champs',
        coordinates: [location[0] - 0.001, location[1] + 0.002],
        type: 'cafe',
        category: 'restaurant',
        distance: 0.3,
        duration: 4
      }
    ];
  }
};
