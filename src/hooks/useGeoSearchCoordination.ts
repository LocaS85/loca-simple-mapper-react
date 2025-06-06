
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
    coordinates: geoCoordinates,
    error: geoError,
    requestLocation
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  });

  // Debounced search with proper validation
  const debouncedSearch = useDebounce((query?: string) => {
    if (query && typeof query === 'string' && query.trim()) {
      performSearch(query);
    }
  }, 500);

  // Update user location when geolocation changes
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      setUserLocation([geoCoordinates[0], geoCoordinates[1]]);
    }
  }, [geoCoordinates, userLocation, setUserLocation]);

  // Handle geolocation errors with better messages
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir votre position. Utilisation de la position par défaut (Paris).",
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  // Coordinated filter update with validation
  const updateCoordinatedFilters = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    if (!newFilters || typeof newFilters !== 'object') return;
    
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

  // Enhanced location selection with validation
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
      console.error('Invalid location data:', location);
      return;
    }

    setUserLocation(location.coordinates);
    updateFilters({ query: location.name || '' });
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName || location.name}`,
      variant: "default",
    });
    
    setTimeout(() => loadResults(), 500);
  }, [setUserLocation, updateFilters, loadResults, toast]);

  // Enhanced search function with proper type safety
  const handleSearch = useCallback((query?: string) => {
    if (!query || typeof query !== 'string' || !query.trim()) return;
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Coordinate transport mode changes
  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateCoordinatedFilters({ transport });
  }, [updateCoordinatedFilters]);

  // Get my location with enhanced error handling
  const handleMyLocationClick = useCallback(async () => {
    try {
      await requestLocation();
      
      // Wait for coordinates to be updated
      if (geoCoordinates) {
        const coordinates: [number, number] = [geoCoordinates[0], geoCoordinates[1]];
        setUserLocation(coordinates);
        
        toast({
          title: "Position mise à jour",
          description: "Votre localisation a été actualisée avec succès",
          variant: "default",
        });
        
        setTimeout(() => loadResults(), 500);
      }
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position. Vérifiez les permissions de géolocalisation.",
        variant: "destructive",
      });
    }
  }, [requestLocation, geoCoordinates, setUserLocation, loadResults, toast]);

  // Status indicators with enhanced information
  const statusInfo = useMemo(() => ({
    hasResults: Array.isArray(results) && results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading,
    networkOk: networkStatus === 'online',
    totalResults: Array.isArray(results) ? results.length : 0
  }), [results, isMapboxReady, userLocation, isLoading, networkStatus]);

  return {
    // State
    userLocation,
    filters,
    results: Array.isArray(results) ? results : [],
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
