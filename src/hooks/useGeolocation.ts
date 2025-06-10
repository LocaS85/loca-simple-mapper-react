
import { useState, useCallback } from 'react';
import { GeoLocationOptions } from '@/types/geosearch';

interface GeolocationState {
  coordinates: [number, number] | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = (options: GeoLocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: false
  });

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const {
      enableHighAccuracy = true,
      timeout = 15000,
      maximumAge = 300000
    } = options;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: [position.coords.longitude, position.coords.latitude],
          error: null,
          isLoading: false
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [options]);

  return {
    ...state,
    requestLocation
  };
};
