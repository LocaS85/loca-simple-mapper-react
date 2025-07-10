
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { getMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/types/unified';
import { useTranslation } from 'react-i18next';

interface EnhancedMapboxDirectionsProps {
  map: mapboxgl.Map | null;
  transportMode?: TransportMode;
  origin?: [number, number];
  destination?: [number, number];
  onRouteCalculated?: (route: {
    distance: number;
    duration: number;
    geometry: any;
  }) => void;
  showInstructions?: boolean;
}

const transportModeToProfile = (mode: TransportMode): string => {
  switch (mode) {
    case 'car': return 'mapbox/driving';
    case 'walking': return 'mapbox/walking';
    case 'cycling': return 'mapbox/cycling';
    case 'bus':
    case 'transit': return 'mapbox/driving'; // Fallback car Mapbox n'a pas de profil transit
    default: return 'mapbox/driving';
  }
};

const EnhancedMapboxDirections: React.FC<EnhancedMapboxDirectionsProps> = ({
  map,
  transportMode = 'car',
  origin,
  destination,
  onRouteCalculated,
  showInstructions = false
}) => {
  const directionsRef = useRef<MapboxDirections | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!map) return;

    const token = getMapboxToken();
    if (!token) {
      console.error('Mapbox token manquant');
      return;
    }

    // Initialiser le contrôle de directions s'il n'existe pas déjà
    if (!directionsRef.current) {
      directionsRef.current = new MapboxDirections({
        accessToken: token,
        unit: 'metric',
        profile: transportModeToProfile(transportMode),
        alternatives: true,
        congestion: true,
        language: 'fr',
        controls: {
          inputs: true,
          instructions: showInstructions,
          profileSwitcher: true
        },
        placeholderOrigin: t('map.startPoint'),
        placeholderDestination: t('map.destination')
      });

      // Utiliser l'assertion de type pour résoudre l'erreur de compatibilité
      map.addControl(directionsRef.current as unknown as mapboxgl.IControl, 'top-left');
      
      // Écouter les événements de route
      directionsRef.current.on('route', (e) => {
        if (e && e.route && e.route[0] && onRouteCalculated) {
          const route = e.route[0];
          onRouteCalculated({
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry
          });
        }
      });
    }

    // Mettre à jour le mode de transport si nécessaire
    if (directionsRef.current) {
      directionsRef.current.setProfile(transportModeToProfile(transportMode));
    }

    // Définir l'origine et la destination si fournies
    if (directionsRef.current) {
      if (origin) {
        directionsRef.current.setOrigin([origin[0], origin[1]]);
      }
      
      if (destination) {
        directionsRef.current.setDestination([destination[0], destination[1]]);
      }
    }

    // Nettoyer à la destruction
    return () => {
      if (directionsRef.current && map) {
        try {
          map.removeControl(directionsRef.current as unknown as mapboxgl.IControl);
        } catch (e) {
          console.warn('Erreur lors du retrait du contrôle de directions:', e);
        }
        directionsRef.current = null;
      }
    };
  }, [map, transportMode, origin, destination, showInstructions, t, onRouteCalculated]);

  // Ce composant ne rend rien directement, il manipule juste la carte
  return null;
};

export default EnhancedMapboxDirections;
