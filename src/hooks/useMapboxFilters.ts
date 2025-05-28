
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  searchPlacesWithFilters, 
  getDirectionsWithFilters,
  createIsochrone,
  FilterSearchParams,
  FilterSearchResult
} from '@/services/mapboxFilterService';
import { TransportMode } from '@/lib/data/transportModes';

// Hook pour la recherche avec filtres
export const useFilteredSearch = (params: FilterSearchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mapbox-filtered-search', params],
    queryFn: () => searchPlacesWithFilters(params),
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
    }) => getDirectionsWithFilters(origin, destination, transportMode),
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
    }) => createIsochrone(center, duration, transportMode),
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
    queryFn: () => searchPlacesWithFilters(params),
    enabled: enabled && !!params.center,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  }));

  return queries;
};
