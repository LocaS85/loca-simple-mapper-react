
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeoSearchState } from './useGeoSearchState';
import { useGeoSearchActions } from './useGeoSearchActions';
import { useGeoSearchLocation } from './useGeoSearchLocation';

export const useGeoSearchManager = () => {
  const { toast } = useToast();
  const { initializeMapbox } = useGeoSearchStore();

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
    updateFilters,
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
    updateFilters,
    setUserLocation,
    searchQuery,
    setSearchQuery
  });

  const { handleMyLocationClick } = useGeoSearchLocation({
    userLocation,
    setUserLocation,
    performSearch
  });

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
    clearCache
  };
};
