import { useGeoSearchStore } from '@/store/geoSearchStore';
import { GeoSearchFilters } from '@/types/geosearch';
import { useCallback } from 'react';

/**
 * Hook central pour la gestion des recherches géographiques
 * Centralise toute la logique métier de GeoSearch
 */
export const useGeoSearch = () => {
  const store = useGeoSearchStore();
  
  const {
    userLocation,
    startingPosition,
    filters,
    results,
    isLoading,
    showFilters,
    isMapboxReady,
    mapboxError,
    networkStatus,
    retryCount,
    updateFilters,
    setFiltersFromParams,
    resetFilters,
    performSearch,
    loadResults,
    setUserLocation,
    setStartingPosition,
    toggleFilters,
    setShowFilters,
    initializeMapbox,
    clearCache
  } = store;

  // Recherche avec mise à jour des filtres
  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    updateFilters(newFilters);
    if (userLocation && isMapboxReady) {
      loadResults();
    }
  }, [updateFilters, userLocation, isMapboxReady, loadResults]);

  // Recherche rapide par requête
  const quickSearch = useCallback((query: string) => {
    updateFilters({ query });
    if (userLocation && isMapboxReady) {
      performSearch(query);
    }
  }, [updateFilters, userLocation, isMapboxReady, performSearch]);

  // Détection de géolocalisation
  const requestGeolocation = useCallback((force = false) => {
    if (!navigator.geolocation) {
      console.error('❌ Géolocalisation non supportée');
      return Promise.reject(new Error('Géolocalisation non supportée'));
    }

    return new Promise<[number, number]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          console.log('📍 Position détectée:', coords);
          setUserLocation(coords);
          resolve(coords);
        },
        (error) => {
          console.error('❌ Erreur géolocalisation:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: force ? 15000 : 10000,
          maximumAge: force ? 0 : 300000
        }
      );
    });
  }, [setUserLocation]);

  // État dérivé pour l'interface
  const canSearch = isMapboxReady && (userLocation || startingPosition);
  const hasResults = results.length > 0;
  const isReady = isMapboxReady && !isLoading;

  return {
    // État
    userLocation,
    startingPosition,
    filters,
    results,
    isLoading,
    showFilters,
    isMapboxReady,
    mapboxError,
    networkStatus,
    retryCount,
    canSearch,
    hasResults,
    isReady,

    // Actions principales
    updateFilters,
    updateFiltersWithSearch,
    setFiltersFromParams,
    resetFilters,
    performSearch,
    quickSearch,
    loadResults,
    
    // Géolocalisation
    setUserLocation,
    setStartingPosition,
    requestGeolocation,
    
    // Interface
    toggleFilters,
    setShowFilters,
    
    // Système
    initializeMapbox,
    clearCache
  };
};