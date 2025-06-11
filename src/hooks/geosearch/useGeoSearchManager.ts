
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeoSearchState } from './useGeoSearchState';
import { useGeoSearchActions } from './useGeoSearchActions';
import { useGeoSearchLocation } from './useGeoSearchLocation';

export const useGeoSearchManager = () => {
  const { toast } = useToast();
  const { initializeMapbox, updateFilters } = useGeoSearchStore();

  const {
    searchQuery,
    setSearchQuery,
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    setUserLocation,
    updateFilters: storeUpdateFilters,
    setResults,
    setIsLoading,
    clearCache
  } = useGeoSearchState();

  const {
    debouncedSearchQuery,
    performSearch,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleTransportChange
  } = useGeoSearchActions({
    userLocation,
    filters,
    isMapboxReady,
    setResults,
    setIsLoading,
    updateFilters: storeUpdateFilters,
    setUserLocation,
    searchQuery,
    setSearchQuery
  });

  const { handleMyLocationClick } = useGeoSearchLocation({
    userLocation,
    setUserLocation,
    performSearch
  });

  // Method to set filters from URL params
  const setFiltersFromParams = (params: Record<string, string>) => {
    const newFilters: any = {};
    
    if (params.q) newFilters.query = params.q;
    if (params.category) newFilters.category = params.category;
    if (params.subcategory) newFilters.subcategory = params.subcategory;
    if (params.transport) newFilters.transport = params.transport;
    if (params.distance) newFilters.distance = parseFloat(params.distance);
    if (params.maxDuration) newFilters.maxDuration = parseInt(params.maxDuration);
    if (params.aroundMeCount) newFilters.aroundMeCount = parseInt(params.aroundMeCount);
    
    if (Object.keys(newFilters).length > 0) {
      updateFilters(newFilters);
    }
  };

  // Initialize Mapbox on mount
  useEffect(() => {
    const initMapbox = async () => {
      try {
        if (!isMapboxReady) {
          console.log('🔧 Initialisation de Mapbox...');
          await initializeMapbox();
        }
      } catch (error) {
        console.error('❌ Erreur d\'initialisation Mapbox:', error);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser les services de carte",
          variant: "destructive",
        });
      }
    };

    initMapbox();
  }, [isMapboxReady, initializeMapbox, toast]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && userLocation && isMapboxReady) {
      performSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, userLocation, isMapboxReady, performSearch]);

  return {
    // State
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    searchQuery,
    
    // Actions
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleTransportChange,
    handleMyLocationClick,
    performSearch,
    clearCache,
    setFiltersFromParams
  };
};
