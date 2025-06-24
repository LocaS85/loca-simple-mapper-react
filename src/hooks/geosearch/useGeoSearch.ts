
import { useCallback } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useDebounce } from '@/hooks/useDebounce';
import { GeoSearchFilters } from '@/types/geosearch';

interface UseGeoSearchOptions {
  debounceMs?: number;
  autoSearch?: boolean;
}

export const useGeoSearch = (options: UseGeoSearchOptions = {}) => {
  const { debounceMs = 300, autoSearch = true } = options;
  
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    updateFilters,
    setUserLocation,
    performSearch,
    resetFilters,
    clearCache
  } = useGeoSearchStore();

  const debouncedQuery = useDebounce(filters.query || '', debounceMs);

  // Unified search handler
  const handleSearch = useCallback(async (query?: string) => {
    if (query) {
      updateFilters({ query });
    }
    await performSearch(query);
  }, [updateFilters, performSearch]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    setUserLocation(location.coordinates);
    if (location.name !== filters.query) {
      handleSearch(location.name);
    }
  }, [setUserLocation, filters.query, handleSearch]);

  // Filter update with optional auto-search
  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    updateFilters(newFilters);
    
    if (autoSearch && userLocation && isMapboxReady) {
      setTimeout(() => performSearch(), 100);
    }
  }, [updateFilters, autoSearch, userLocation, isMapboxReady, performSearch]);

  // Status information
  const statusInfo = {
    hasResults: results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading && userLocation !== null,
    networkOk: networkStatus === 'online',
    totalResults: results.length,
    isInitialized: isMapboxReady && !!userLocation
  };

  return {
    // State
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    debouncedQuery,
    
    // Actions
    handleSearch,
    handleLocationSelect,
    updateFiltersWithSearch,
    setUserLocation,
    resetFilters,
    clearCache,
    performSearch
  };
};
