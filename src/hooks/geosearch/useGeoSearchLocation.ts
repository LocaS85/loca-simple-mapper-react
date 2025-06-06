
import { useEffect, useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/use-toast';

interface UseGeoSearchLocationProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number]) => void;
  performSearch: (query?: string) => void;
}

export const useGeoSearchLocation = ({
  userLocation,
  setUserLocation,
  performSearch
}: UseGeoSearchLocationProps) => {
  const { toast } = useToast();

  const {
    coordinates: geoCoordinates,
    error: geoError,
    requestLocation
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000
  });

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

  return {
    handleMyLocationClick
  };
};
