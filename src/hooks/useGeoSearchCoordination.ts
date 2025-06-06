
import { useMemo } from 'react';
import { useGeoSearchManager } from './geosearch/useGeoSearchManager';

export const useGeoSearchCoordination = () => {
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo
  } = useGeoSearchManager();

  // Enhanced status information
  const enhancedStatusInfo = useMemo(() => ({
    ...statusInfo,
    isFullyReady: isMapboxReady && userLocation !== null && !isLoading,
    hasValidLocation: userLocation !== null && Array.isArray(userLocation),
    canPerformSearch: isMapboxReady && userLocation !== null && networkStatus === 'online'
  }), [statusInfo, isMapboxReady, userLocation, isLoading, networkStatus]);

  return {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo: enhancedStatusInfo
  };
};
