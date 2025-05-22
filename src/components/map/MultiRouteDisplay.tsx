
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { TransportMode } from '@/types';
import { calculateMultipleRoutes } from '@/utils/mapboxIntegration';

interface MultiRouteDisplayProps {
  map: mapboxgl.Map | null;
  origin: [number, number];
  destinations: Array<{
    id: string;
    coordinates: [number, number];
    name?: string;
  }>;
  transportMode?: TransportMode;
  showLines?: boolean;
  lineColor?: string;
  onRoutesCalculated?: (routes: any[]) => void;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  map,
  origin,
  destinations,
  transportMode = 'car',
  showLines = true,
  lineColor = '#3b82f6',
  onRoutesCalculated
}) => {
  const [routes, setRoutes] = useState<any[]>([]);

  // Calculer tous les itinéraires lorsque les propriétés changent
  useEffect(() => {
    if (!map || !origin || destinations.length === 0) return;

    const sourceIds: string[] = [];
    const layerIds: string[] = [];

    // Supprimer les couches et sources existantes
    map.getStyle().layers?.forEach(layer => {
      if (layer.id.startsWith('route-line-')) {
        map.removeLayer(layer.id);
        layerIds.push(layer.id);
      }
    });

    // Supprimer les sources après les couches
    Object.keys(map.getStyle().sources || {}).forEach(source => {
      if (source.startsWith('route-source-')) {
        map.removeSource(source);
        sourceIds.push(source);
      }
    });

    // Calculer de nouveaux itinéraires
    const fetchRoutes = async () => {
      try {
        const destinationCoords = destinations.map(d => d.coordinates);
        const calculatedRoutes = await calculateMultipleRoutes(origin, destinationCoords, transportMode as 'car' | 'walking' | 'cycling');
        setRoutes(calculatedRoutes);
        
        if (onRoutesCalculated) {
          onRoutesCalculated(calculatedRoutes);
        }

        if (showLines && calculatedRoutes.length > 0) {
          // Afficher les lignes d'itinéraire sur la carte
          calculatedRoutes.forEach((routeData, index) => {
            const sourceId = `route-source-${index}`;
            const layerId = `route-line-${index}`;

            // Ajouter la source pour l'itinéraire
            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: routeData.route.geometry
              }
            });

            // Ajouter la couche de ligne
            map.addLayer({
              id: layerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': lineColor,
                'line-width': 3,
                'line-opacity': 0.7,
                'line-dasharray': [0, 2, 1]
              }
            });
          });

          // Ajuster les limites de la carte pour afficher tous les itinéraires
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(origin);
          destinations.forEach(d => {
            bounds.extend(d.coordinates);
          });

          map.fitBounds(bounds, {
            padding: 50
          });
        }
      } catch (error) {
        console.error('Erreur lors du calcul des itinéraires:', error);
      }
    };

    fetchRoutes();

    // Nettoyage lors du démontage
    return () => {
      if (map) {
        layerIds.forEach(id => {
          if (map.getLayer(id)) {
            map.removeLayer(id);
          }
        });
        
        sourceIds.forEach(id => {
          if (map.getSource(id)) {
            map.removeSource(id);
          }
        });
      }
    };
  }, [map, origin, destinations, transportMode, showLines, lineColor, onRoutesCalculated]);

  return null; // Ce composant ne rend rien visuellement
};

export default MultiRouteDisplay;
