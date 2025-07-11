
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
        categories: Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : undefined
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

  async searchPlaces(params: {
    query?: string;
    center: [number, number];
    category?: string;
    radius?: number;
    limit?: number;
  }): Promise<SearchPlace[]> {
    try {
      const searchResults = await this.search({
        query: params.query || 'restaurant',
        location: params.center,
        filters: {
          category: params.category,
          distance: params.radius || 10,
          aroundMeCount: params.limit || 5,
          transport: 'walking',
          unit: 'km',
          query: params.query || '',
          maxDuration: 30,
          showMultiDirections: false
        }
      });

      return searchResults.map(result => ({
        id: result.id,
        name: result.name,
        address: result.address || 'Adresse non disponible',
        coordinates: result.coordinates,
        category: result.category || 'place',
        distance: result.distance,
        duration: result.duration
      }));
    } catch (error) {
      console.error('❌ Search places error:', error);
      return [];
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

// Export avec l'ancien nom pour compatibilité
export const unifiedSearchService = unifiedApiService;
