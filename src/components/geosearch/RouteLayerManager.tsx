
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';

interface RouteLayerManagerProps {
  map: mapboxgl.Map | null;
  routes: {
    [key in TransportMode]?: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  };
  showLegend?: boolean;
}

const transportColors = {
  car: '#3B82F6',      // Bleu
  walking: '#10B981',   // Vert
  cycling: '#F59E0B',   // Orange
  bus: '#8B5CF6',       // Violet
  train: '#EF4444'      // Rouge
};

const RouteLayerManager: React.FC<RouteLayerManagerProps> = ({
  map,
  routes,
  showLegend = true
}) => {
  // Créer les couches pour chaque mode de transport
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Supprimer les anciennes couches
    Object.keys(transportColors).forEach(mode => {
      const sourceId = `route-${mode}`;
      const layerId = `route-line-${mode}`;
      
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });

    // Ajouter les nouvelles couches
    Object.entries(routes).forEach(([mode, routeData]) => {
      if (!routeData || !routeData.features.length) return;

      const sourceId = `route-${mode}`;
      const layerId = `route-line-${mode}`;
      const color = transportColors[mode as TransportMode] || '#6B7280';

      // Ajouter la source
      map.addSource(sourceId, {
        type: 'geojson',
        data: routeData
      });

      // Ajouter la couche
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 6],
          'line-opacity': 0.8
        }
      });
    });

  }, [map, routes]);

  return null;
};

export default RouteLayerManager;
