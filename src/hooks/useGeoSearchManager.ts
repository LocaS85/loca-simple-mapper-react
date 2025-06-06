
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { geoSearchService } from '@/services/geoSearchService';
import { TransportMode } from '@/lib/data/transportModes';
import { GeoSearchFilters } from '@/types/geosearch';

export const useGeoSearchManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  // Auto-update user location from geolocation
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      const coordinates: [number, number] = [geoCoordinates[0], geoCoordinates[1]];
      console.log('📍 Mise à jour de la position utilisateur:', coordinates);
      setUserLocation(coordinates);
    }
  }, [geoCoordinates, userLocation, setUserLocation]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      console.error('❌ Erreur de géolocalisation:', geoError);
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir votre position. Utilisation de la position par défaut.",
        variant: "destructive",
      });
      if (!userLocation) {
        setUserLocation([2.3522, 48.8566]);
      }
    }
  }, [geoError, toast, userLocation, setUserLocation]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && userLocation && isMapboxReady) {
      performSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, userLocation, isMapboxReady]);

  // Main search function
  const performSearch = useCallback(async (query?: string) => {
    if (!userLocation || !isMapboxReady) {
      console.log('❌ Conditions non remplies pour la recherche');
      return;
    }

    setIsLoading(true);
    try {
      let searchResults;
      
      if (query && query.trim()) {
        console.log('🔍 Recherche par requête:', query);
        searchResults = await geoSearchService.searchByQuery(query, userLocation, filters);
      } else {
        console.log('🔍 Recherche à proximité');
        searchResults = await geoSearchService.searchNearby(userLocation, filters);
      }
      
      setResults(searchResults);
      console.log('✅ Recherche terminée:', searchResults.length, 'résultats');
      
      if (searchResults.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun lieu trouvé pour votre recherche",
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche. Vérifiez votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, filters, isMapboxReady, setIsLoading, setResults, toast]);

  // Enhanced filters update
  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    if (!newFilters || typeof newFilters !== 'object') {
      console.warn('❌ Filtres invalides:', newFilters);
      return;
    }

    updateFilters(newFilters);
    
    // Auto-trigger search for important filter changes
    const criticalFilters = ['category', 'transport', 'distance', 'maxDuration'];
    const shouldAutoSearch = Object.keys(newFilters).some(key => 
      criticalFilters.includes(key)
    );
    
    if (shouldAutoSearch && userLocation && isMapboxReady) {
      console.log('🔄 Auto-recherche déclenchée par changement de filtres');
      setTimeout(() => performSearch(searchQuery), 300);
    }
  }, [updateFilters, userLocation, isMapboxReady, performSearch, searchQuery]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    if (!location?.coordinates || !Array.isArray(location.coordinates)) {
      console.error('❌ Données de lieu invalides:', location);
      return;
    }

    console.log('📍 Sélection de lieu:', location);
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name || '' });
    setSearchQuery(location.name || '');
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName || location.name}`,
      variant: "default",
    });
    
    setTimeout(() => performSearch(location.name), 500);
  }, [setUserLocation, updateFilters, performSearch]);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    if (typeof query !== 'string') {
      console.log('❌ Requête de recherche invalide:', query);
      return;
    }
    console.log('🔍 Déclenchement de recherche:', query);
    setSearchQuery(query);
  }, []);

  // My location handler
  const handleMyLocationClick = useCallback(async () => {
    try {
      console.log('🌍 Demande de géolocalisation...');
      await requestLocation();
      
      toast({
        title: "Localisation en cours",
        description: "Recherche de votre position...",
        variant: "default",
      });
    } catch (error) {
      console.error('❌ Erreur de géolocalisation:', error);
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position. Vérifiez les permissions.",
        variant: "destructive",
      });
    }
  }, [requestLocation, toast]);

  // Transport change handler
  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateFiltersWithSearch({ transport });
  }, [updateFiltersWithSearch]);

  // Status information
  const statusInfo = useMemo(() => ({
    hasResults: Array.isArray(results) && results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading && userLocation !== null,
    networkOk: networkStatus === 'online',
    totalResults: Array.isArray(results) ? results.length : 0,
    isInitialized: isMapboxReady && !!userLocation
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
