
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { TransportMode } from '@/types/map';
import { calculateMultipleRoutes } from '@/utils/mapboxIntegration';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';

const transportColors: Record<string, string> = {
  walking: '#4CAF50',      // vert
  car: '#2196F3',          // bleu (renommé de driving)
  cycling: '#FF9800',      // orange
  bus: '#9C27B0',          // violet
  train: '#FF5722'         // rouge
};

interface MultiRouteDisplayProps {
  map: mapboxgl.Map | null;
  origin: [number, number];
  destinations: Array<{
    id: string;
    coordinates: [number, number];
    name?: string;
  }>;
  transportModes?: TransportMode[];
  onRoutesCalculated?: (routes: any[]) => void;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  map,
  origin,
  destinations,
  transportModes = ['car', 'walking', 'cycling'],
  onRoutesCalculated
}) => {
  const [routeResultsByMode, setRouteResultsByMode] = useState<Record<string, GeoJSON.FeatureCollection>>({});

  useEffect(() => {
    if (!map || !origin || destinations.length === 0 || !map.isStyleLoaded()) return;

    const calculateAllRoutes = async () => {
      const routesByMode: Record<string, GeoJSON.FeatureCollection> = {};

      // Calculer les itinéraires pour chaque mode de transport
      for (const mode of transportModes) {
        try {
          const destinationCoords = destinations.map(d => d.coordinates);
          const routes = await calculateMultipleRoutes(origin, destinationCoords, mode);
          
          // Convertir en GeoJSON FeatureCollection
          const features = routes.map((route, index) => ({
            type: 'Feature' as const,
            properties: {
              mode,
              destinationId: destinations[index]?.id,
              distance: route.distance,
              duration: route.duration
            },
            geometry: route.geometry || {
              type: 'LineString' as const,
              coordinates: [origin, destinations[index].coordinates]
            }
          }));

          routesByMode[mode] = {
            type: 'FeatureCollection',
            features
          };
        } catch (error) {
          console.error(`Erreur calcul itinéraire pour ${mode}:`, error);
        }
      }

      setRouteResultsByMode(routesByMode);
    };

    calculateAllRoutes();
  }, [map, origin, destinations, transportModes]);

  // Afficher les routes sur la carte
  useEffect(() => {
    if (!map || !routeResultsByMode || !map.isStyleLoaded()) return;

    // Nettoyer les anciennes couches
    Object.keys(transportColors).forEach(mode => {
      const routeId = `route-${mode}`;
      if (map.getLayer(routeId)) {
        map.removeLayer(routeId);
      }
      if (map.getSource(routeId)) {
        map.removeSource(routeId);
      }
    });

    // Ajouter les nouvelles couches
    Object.entries(routeResultsByMode).forEach(([mode, geojson]) => {
      const routeId = `route-${mode}`;
      
      map.addSource(routeId, {
        type: 'geojson',
        data: geojson,
      });
      
      map.addLayer({
        id: routeId,
        type: 'line',
        source: routeId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': transportColors[mode] || '#000000',
          'line-width': 4,
          'line-opacity': 0.7,
        },
      });
    });

    // Ajuster la vue pour inclure tous les itinéraires
    if (Object.keys(routeResultsByMode).length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(origin);
      destinations.forEach(dest => bounds.extend(dest.coordinates));
      
      map.fitBounds(bounds, { padding: 50 });
    }

    // Nettoyage
    return () => {
      Object.keys(routeResultsByMode).forEach((mode) => {
        const id = `route-${mode}`;
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      });
    };
  }, [map, routeResultsByMode, origin, destinations]);

  return null;
};

export default MultiRouteDisplay;
