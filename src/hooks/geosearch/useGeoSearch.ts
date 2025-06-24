
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { GeoSearchFilters, SearchResult } from '@/store/geoSearchStore/types';

interface UseGeoSearchOptions {
  debounceMs?: number;
  autoSearch?: boolean;
}

export const useGeoSearch = (options: UseGeoSearchOptions = {}) => {
  const { debounceMs = 300, autoSearch = true } = options;
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
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
    clearCache,
    initializeMapbox,
    setFiltersFromParams
  } = useGeoSearchStore();

  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  // Initialize Mapbox on mount
  useEffect(() => {
    if (!isMapboxReady) {
      initializeMapbox().catch(error => {
        console.error('Failed to initialize Mapbox:', error);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser les services de carte",
          variant: "destructive",
        });
      });
    }
  }, [isMapboxReady, initializeMapbox, toast]);

  // Geolocation handler
  const handleMyLocationClick = useCallback(async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      const fallbackCoords: [number, number] = [2.3522, 48.8566];
      setUserLocation(fallbackCoords);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 300000
          }
        );
      });

      const coordinates: [number, number] = [
        position.coords.longitude,
        position.coords.latitude
      ];

      console.log('📍 Position détectée avec succès:', coordinates);
      setUserLocation(coordinates);
      
      toast({
        title: "Position détectée",
        description: `Position: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`,
      });

    } catch (error) {
      console.error('❌ Erreur de géolocalisation:', error);
      const fallbackCoords: [number, number] = [2.3522, 48.8566];
      setUserLocation(fallbackCoords);
      
      toast({
        title: "Position par défaut",
        description: "Utilisation de Paris par défaut",
        variant: "default",
      });
    }
  }, [setUserLocation, toast]);

  // Unified search handler
  const handleSearch = useCallback(async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm) {
      updateFilters({ query: searchTerm });
      setSearchQuery(searchTerm);
    }
    await performSearch(searchTerm);
  }, [searchQuery, updateFilters, performSearch]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    setUserLocation(location.coordinates);
    setSearchQuery(location.name);
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
  const statusInfo = useMemo(() => ({
    hasResults: results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading && userLocation !== null,
    networkOk: networkStatus === 'online',
    totalResults: results.length,
    isInitialized: isMapboxReady && !!userLocation,
    isFullyReady: isMapboxReady && userLocation !== null && !isLoading,
    hasValidLocation: userLocation !== null && Array.isArray(userLocation),
    canPerformSearch: isMapboxReady && userLocation !== null && networkStatus === 'online'
  }), [results, isMapboxReady, userLocation, isLoading, networkStatus]);

  return {
    // State
    searchQuery,
    setSearchQuery,
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
    handleMyLocationClick,
    updateFiltersWithSearch,
    setUserLocation,
    resetFilters,
    clearCache,
    performSearch,
    setFiltersFromParams
  };
};
