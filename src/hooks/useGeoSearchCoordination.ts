
import { useCallback, useEffect, useMemo } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { TransportMode } from '@/lib/data/transportModes';
import { GeoSearchFilters } from '@/types/geosearch';

export const useGeoSearchCoordination = () => {
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
    loadResults,
    performSearch,
    clearCache
  } = useGeoSearchStore();

  const {
    location: geoLocation,
    error: geoError,
    requestLocation
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  });

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebounce((query: string) => {
    if (query.trim()) {
      performSearch(query);
    }
  }, 500);

  // Update user location when geolocation changes
  useEffect(() => {
    if (geoLocation && !userLocation) {
      setUserLocation([geoLocation.longitude, geoLocation.latitude]);
    }
  }, [geoLocation, userLocation, setUserLocation]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir votre position. Position par défaut utilisée.",
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  // Coordinated filter update
  const updateCoordinatedFilters = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    updateFilters(newFilters);
    
    // Auto-trigger search for critical filter changes
    const criticalFilters = ['category', 'transport', 'distance'];
    const shouldAutoSearch = Object.keys(newFilters).some(key => 
      criticalFilters.includes(key)
    );
    
    if (shouldAutoSearch && userLocation) {
      setTimeout(() => loadResults(), 300);
    }
  }, [updateFilters, userLocation, loadResults]);

  // Enhanced location selection
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
    
    setTimeout(() => loadResults(), 500);
  }, [setUserLocation, updateFilters, loadResults, toast]);

  // Enhanced search function
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Coordinate transport mode changes
  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateCoordinatedFilters({ transport });
  }, [updateCoordinatedFilters]);

  // Get my location with enhanced error handling
  const handleMyLocationClick = useCallback(async () => {
    try {
      const location = await requestLocation();
      if (location) {
        const coordinates: [number, number] = [location.longitude, location.latitude];
        setUserLocation(coordinates);
        
        toast({
          title: "Position mise à jour",
          description: "Votre localisation a été actualisée",
          variant: "default",
        });
        
        setTimeout(() => loadResults(), 500);
      }
    } catch (error) {
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position",
        variant: "destructive",
      });
    }
  }, [requestLocation, setUserLocation, loadResults, toast]);

  // Status indicators
  const statusInfo = useMemo(() => ({
    hasResults: results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading,
    networkOk: networkStatus === 'online'
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
    updateCoordinatedFilters,
    handleLocationSelect,
    handleSearch,
    handleTransportChange,
    handleMyLocationClick,
    loadResults,
    clearCache,
    
    // Utilities
    debouncedSearch
  };
};
