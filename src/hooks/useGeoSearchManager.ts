
import { useCallback, useEffect, useMemo } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { geoSearchService } from '@/services/geoSearchService';
import { TransportMode } from '@/lib/data/transportModes';
import { GeoSearchFilters } from '@/types/geosearch';

export const useGeoSearchManager = () => {
  const { toast } = useToast();
  
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    setUserLocation,
    updateFilters,
    setResults,
    setIsLoading,
    initializeMapbox,
    clearCache
  } = useGeoSearchStore();

  const {
    coordinates: geoCoordinates,
    error: geoError,
    requestLocation
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000
  });

  // Initialize Mapbox on mount
  useEffect(() => {
    if (!isMapboxReady) {
      initializeMapbox();
    }
  }, [isMapboxReady, initializeMapbox]);

  // Auto-update user location from geolocation
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      setUserLocation([geoCoordinates[0], geoCoordinates[1]]);
    }
  }, [geoCoordinates, userLocation, setUserLocation]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir votre position",
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  // Debounced search - Fixed to handle undefined values
  const debouncedSearch = useDebounce(async (query: string) => {
    if (query && query.trim() && userLocation) {
      await performSearch(query);
    }
  }, 500);

  // Unified search function
  const performSearch = useCallback(async (query?: string) => {
    if (!userLocation || !isMapboxReady) {
      console.log('❌ Conditions non remplies pour la recherche');
      return;
    }

    setIsLoading(true);
    try {
      let searchResults;
      
      if (query && query.trim()) {
        searchResults = await geoSearchService.searchByQuery(query, userLocation, filters);
      } else {
        searchResults = await geoSearchService.searchNearby(userLocation, filters);
      }
      
      setResults(searchResults);
      console.log('✅ Recherche terminée:', searchResults.length, 'résultats');
      
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, filters, isMapboxReady, setIsLoading, setResults, toast]);

  // Enhanced filters update with auto-search
  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    updateFilters(newFilters);
    
    // Auto-trigger search for important filter changes
    const criticalFilters = ['category', 'transport', 'distance', 'maxDuration'];
    const shouldAutoSearch = Object.keys(newFilters).some(key => 
      criticalFilters.includes(key)
    );
    
    if (shouldAutoSearch && userLocation) {
      setTimeout(() => performSearch(), 300);
    }
  }, [updateFilters, userLocation, performSearch]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name });
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName}`,
      variant: "default",
    });
    
    setTimeout(() => performSearch(), 500);
  }, [setUserLocation, updateFilters, performSearch, toast]);

  // My location handler
  const handleMyLocationClick = useCallback(async () => {
    try {
      await requestLocation();
      
      if (geoCoordinates) {
        const coordinates: [number, number] = [geoCoordinates[0], geoCoordinates[1]];
        setUserLocation(coordinates);
        
        toast({
          title: "Position mise à jour",
          description: "Votre localisation a été actualisée",
          variant: "default",
        });
        
        setTimeout(() => performSearch(), 500);
      }
    } catch (error) {
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position",
        variant: "destructive",
      });
    }
  }, [requestLocation, geoCoordinates, setUserLocation, performSearch, toast]);

  // Search handler - Fixed to handle undefined values
  const handleSearch = useCallback((query?: string) => {
    if (!query || !query.trim()) return;
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Transport change handler
  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateFiltersWithSearch({ transport });
  }, [updateFiltersWithSearch]);

  // Status information
  const statusInfo = useMemo(() => ({
    hasResults: results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading,
    networkOk: networkStatus === 'online',
    totalResults: results.length
  }), [results.length, isMapboxReady, userLocation, isLoading, networkStatus]);

  return {
    // State
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    
    // Actions
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleTransportChange,
    handleMyLocationClick,
    performSearch,
    clearCache,
    
    // Utilities
    debouncedSearch
  };
};
