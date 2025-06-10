import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { unifiedSearchService } from '@/services/unifiedApiService';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';
import { transformSearchPlacesToResults } from '@/services/searchResultTransformer';

interface UseGeoSearchActionsProps {
  userLocation: [number, number] | null;
  filters: GeoSearchFilters;
  isMapboxReady: boolean;
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  setUserLocation: (location: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useGeoSearchActions = ({
  userLocation,
  filters,
  isMapboxReady,
  setResults,
  setIsLoading,
  updateFilters,
  setUserLocation,
  searchQuery,
  setSearchQuery
}: UseGeoSearchActionsProps) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = useCallback(async (query?: string) => {
    if (!userLocation || !isMapboxReady) {
      console.log('⚠️ Search skipped: missing location or Mapbox not ready');
      return;
    }

    const searchTerm = query || filters.query || debouncedSearchQuery;
    if (!searchTerm && !filters.category) {
      console.log('⚠️ Search skipped: no query or category');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Performing unified search:', { searchTerm, filters, userLocation });
      
      const searchResults = await unifiedSearchService.searchPlaces({
        query: searchTerm,
        category: filters.category || undefined,
        subcategory: filters.subcategory || undefined,
        transport: filters.transport,
        distance: filters.distance,
        unit: filters.unit,
        aroundMeCount: filters.aroundMeCount,
        showMultiDirections: filters.showMultiDirections,
        maxDuration: filters.maxDuration,
        center: userLocation
      });

      console.log('✅ Search results received:', searchResults.length);
      
      // Transformer les résultats pour s'assurer qu'ils correspondent au type SearchResult
      const transformedResults = searchResults.map(result => ({
        ...result,
        type: result.type || result.category || 'point_of_interest' // Assurer que le type existe
      }));
      
      setResults(transformedResults);
    } catch (error) {
      console.error('❌ Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, filters, isMapboxReady, debouncedSearchQuery, setIsLoading, setResults]);

  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    updateFilters(newFilters);
    
    // Trigger search if we have location and relevant filters
    if (userLocation && isMapboxReady) {
      setTimeout(() => performSearch(), 100);
    }
  }, [updateFilters, userLocation, isMapboxReady, performSearch]);

  const handleLocationSelect = useCallback((location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    console.log('📍 Location selected:', location);
    setUserLocation(location.coordinates);
    
    // Update search query if needed
    if (location.name !== searchQuery) {
      setSearchQuery(location.name);
    }
  }, [setUserLocation, searchQuery, setSearchQuery]);

  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm) {
      updateFilters({ query: searchTerm });
      performSearch(searchTerm);
    }
  }, [searchQuery, updateFilters, performSearch]);

  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateFiltersWithSearch({ transport });
  }, [updateFiltersWithSearch]);

  return {
    debouncedSearchQuery,
    performSearch,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleTransportChange
  };
};
