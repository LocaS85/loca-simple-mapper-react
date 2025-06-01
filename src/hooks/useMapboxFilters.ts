
import { useQuery, useMutation } from '@tanstack/react-query';
import { mapboxApiService } from '@/services/mapboxApiService';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult } from '@/types/geosearch';
import { calculateDistance } from '@/store/geoSearchStore/searchLogic';

// Interface pour les paramètres de recherche filtrée
export interface FilterSearchParams {
  center: [number, number];
  query?: string;
  category?: string;
  radius?: number;
  limit?: number;
}

export interface FilterSearchResult {
  results: SearchResult[];
  total: number;
}

// Hook pour la recherche avec filtres
export const useFilteredSearch = (params: FilterSearchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mapbox-filtered-search', params],
    queryFn: async (): Promise<FilterSearchResult> => {
      const results = await mapboxApiService.searchPlaces(
        params.query || 'restaurant',
        params.center,
        {
          limit: params.limit || 5,
          radius: params.radius || 10,
          categories: params.category ? [params.category] : undefined
        }
      );
      
      return {
        results: results.map(result => {
          const distance = calculateDistance(params.center, result.coordinates);
          return {
            id: result.id,
            name: result.name,
            address: result.address,
            coordinates: result.coordinates,
            type: result.category,
            category: result.category,
            distance: Math.round(distance * 10) / 10,
            duration: Math.round(distance * 12) // Estimation based on distance
          };
        }),
        total: results.length
      };
    },
    enabled: enabled && !!params.center,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Hook pour les directions
export const useDirections = () => {
  return useMutation({
    mutationFn: ({
      origin,
      destination,
      transportMode
    }: {
      origin: [number, number];
      destination: [number, number];
      transportMode: TransportMode;
    }) => mapboxApiService.getDirections(origin, destination, transportMode),
    retry: 1
  });
};

// Hook pour les isochrones
export const useIsochrone = () => {
  return useMutation({
    mutationFn: ({
      center,
      duration,
      transportMode
    }: {
      center: [number, number];
      duration: number;
      transportMode: TransportMode;
    }) => mapboxApiService.createIsochrone(center, duration, transportMode),
    retry: 1
  });
};

// Hook pour les recherches multiples avec cache optimisé
export const useMultipleFilteredSearches = (
  searchParams: FilterSearchParams[],
  enabled: boolean = true
) => {
  const queries = searchParams.map((params, index) => ({
    queryKey: ['mapbox-filtered-search', `multi-${index}`, params],
    queryFn: async (): Promise<FilterSearchResult> => {
      const results = await mapboxApiService.searchPlaces(
        params.query || 'restaurant',
        params.center,
        {
          limit: params.limit || 5,
          radius: params.radius || 10,
          categories: params.category ? [params.category] : undefined
        }
      );
      
      return {
        results: results.map(result => {
          const distance = calculateDistance(params.center, result.coordinates);
          return {
            id: result.id,
            name: result.name,
            address: result.address,
            coordinates: result.coordinates,
            type: result.category,
            category: result.category,
            distance: Math.round(distance * 10) / 10,
            duration: Math.round(distance * 12)
          };
        }),
        total: results.length
      };
    },
    enabled: enabled && !!params.center,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  }));

  return queries;
};
