
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapboxDirectionsService } from '@/services/mapbox/directions';
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
  const directionsService = useRef(new MapboxDirectionsService());
  const routeSourceId = useRef('enhanced-directions-route');
  const { t } = useTranslation();

  const clearRoute = () => {
    if (!map) return;
    
    try {
      if (map.getSource(routeSourceId.current)) {
        map.removeLayer(`${routeSourceId.current}-line`);
        map.removeSource(routeSourceId.current);
      }
    } catch (error) {
      console.warn('Erreur lors du nettoyage de l\'itinéraire:', error);
    }
  };

  const calculateRoute = async (originCoords: [number, number], destCoords: [number, number]) => {
    if (!map) return;

    clearRoute();

    try {
      const route = await directionsService.current.getDirections(
        originCoords,
        destCoords,
        transportMode
      );

      // Ajouter l'itinéraire à la carte
      map.addSource(routeSourceId.current, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });

      map.addLayer({
        id: `${routeSourceId.current}-line`,
        type: 'line',
        source: routeSourceId.current,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Callback avec les informations de l'itinéraire
      if (onRouteCalculated) {
        onRouteCalculated(route);
      }

    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
    }
  };

  useEffect(() => {
    if (!map || !origin || !destination) {
      clearRoute();
      return;
    }

    calculateRoute(origin, destination);

    return () => {
      clearRoute();
    };
  }, [map, transportMode, origin, destination, onRouteCalculated]);

  // Ce composant ne rend rien directement, il manipule juste la carte
  return null;
};

export default EnhancedMapboxDirections;
