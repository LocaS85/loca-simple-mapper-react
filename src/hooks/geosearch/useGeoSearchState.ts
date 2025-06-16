
import { useState, useMemo } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

export const useGeoSearchState = () => {
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
    clearCache
  } = useGeoSearchStore();

  const statusInfo = useMemo(() => ({
    hasResults: Array.isArray(results) && results.length > 0,
    isReady: isMapboxReady && userLocation !== null,
    canSearch: isMapboxReady && !isLoading && userLocation !== null,
    networkOk: networkStatus === 'online',
    totalResults: Array.isArray(results) ? results.length : 0,
    isInitialized: isMapboxReady && !!userLocation
  }), [results, isMapboxReady, userLocation, isLoading, networkStatus]);

  return {
    searchQuery,
    setSearchQuery,
    userLocation,
    filters,
    results: Array.isArray(results) ? results : [],
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    setUserLocation,
    updateFilters,
    setResults,
    setIsLoading,
    clearCache
  };
};
