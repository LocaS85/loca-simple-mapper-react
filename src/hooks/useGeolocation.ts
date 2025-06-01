
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface GeolocationState {
  coordinates: [number, number] | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000,
    autoRequest = false
  } = options;

  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    isSupported: 'geolocation' in navigator
  });

  const { toast } = useToast();
  const { t } = useTranslation();

  const requestLocation = () => {
    if (!state.isSupported) {
      const errorMsg = t("geosearch.locationNotSupported");
      setState(prev => ({ ...prev, error: errorMsg }));
      toast({
        title: t("geosearch.locationError"),
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: [number, number] = [
          position.coords.longitude,
          position.coords.latitude
        ];
        
        setState(prev => ({
          ...prev,
          coordinates,
          isLoading: false,
          error: null
        }));

        toast({
          title: t("geosearch.locationDetected"),
          description: t("geosearch.positionUpdated"),
        });
      },
      (error) => {
        let errorMessage = t("geosearch.locationErrorDesc");
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t("geosearch.locationPermissionDenied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t("geosearch.locationUnavailable");
            break;
          case error.TIMEOUT:
            errorMessage = t("geosearch.locationTimeout");
            break;
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));

        toast({
          title: t("geosearch.locationError"),
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  };

  useEffect(() => {
    if (autoRequest && state.isSupported && !state.coordinates) {
      requestLocation();
    }
  }, [autoRequest, state.isSupported, state.coordinates]);

  return {
    ...state,
    requestLocation
  };
};
