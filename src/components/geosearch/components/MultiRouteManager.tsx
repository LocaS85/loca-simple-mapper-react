import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { getDirections } from '@/utils/mapboxSdk';
import { TRANSPORT_COLORS } from './GoogleMapsMap';


interface MultiRouteManagerProps {
  map: mapboxgl.Map;
  userLocation: [number, number] | null;
  results: SearchResult[];
  transport: string;
  showMultiDirections?: boolean;
}

const MultiRouteManager: React.FC<MultiRouteManagerProps> = ({
  map,
  userLocation,
  results,
  transport,
  showMultiDirections = false
}) => {
  useEffect(() => {
    if (!map || !userLocation || results.length === 0 || !showMultiDirections) return;

    const loadRoutes = async () => {
      // Nettoyer les anciennes routes
      clearExistingRoutes(map);

      // Limiter à 5 résultats pour éviter la surcharge
      const limitedResults = results.slice(0, 5);

      for (let i = 0; i < limitedResults.length; i++) {
        const result = limitedResults[i];
        
        try {
          // Mapper le transport vers le profil Mapbox
          const mapboxProfile = getMapboxProfile(transport);
          
          const routeData = await getDirections(
            userLocation,
            result.coordinates,
            mapboxProfile
          );

          if (routeData.routes && routeData.routes.length > 0) {
            const route = routeData.routes[0];
            const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
              type: 'Feature',
              geometry: route.geometry,
              properties: {
                resultId: result.id,
                duration: route.duration,
                distance: route.distance
              }
            };

            addRouteToMap(map, routeGeoJSON, transport, i);
          }
        } catch (error) {
          console.error(`Erreur calcul route pour ${result.name}:`, error);
        }
      }
    };

    loadRoutes();

    return () => {
      clearExistingRoutes(map);
    };
  }, [map, userLocation, results, transport, showMultiDirections]);

  return null;
};

const clearExistingRoutes = (map: mapboxgl.Map) => {
  // Supprimer toutes les couches de routes existantes
  const layers = map.getStyle().layers;
  
  layers?.forEach(layer => {
    if (layer.id.startsWith('route-')) {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    }
  });

  // Supprimer toutes les sources de routes existantes
  Object.keys(map.getStyle().sources || {}).forEach(sourceId => {
    if (sourceId.startsWith('route-')) {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    }
  });
};

const addRouteToMap = (
  map: mapboxgl.Map,
  route: GeoJSON.Feature<GeoJSON.LineString>,
  transport: string,
  index: number
) => {
  const sourceId = `route-${transport}-${index}`;
  const layerId = `route-line-${transport}-${index}`;
  
  // Couleur selon le mode de transport
  const color = TRANSPORT_COLORS[transport as keyof typeof TRANSPORT_COLORS] || '#6B7280';
  
  // Opacité décroissante pour les routes multiples
  const opacity = Math.max(0.3, 1 - (index * 0.15));

  // Ajouter la source
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [route]
    }
  });

  // Ajouter la couche de ligne principale
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
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, index === 0 ? 4 : 3,
        15, index === 0 ? 8 : 6
      ],
      'line-opacity': opacity
    }
  });

  // Ajouter une couche de bordure pour la route principale
  if (index === 0) {
    map.addLayer({
      id: `${layerId}-border`,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 6,
          15, 10
        ],
        'line-opacity': 0.8
      }
    }, layerId);
  }
};

const getMapboxProfile = (transport: string): 'driving' | 'walking' | 'cycling' => {
  switch (transport) {
    case 'car':
      return 'driving';
    case 'walking':
      return 'walking';
    case 'cycling':
      return 'cycling';
    case 'bus':
      return 'driving'; // Approximation pour transport en commun
    default:
      return 'walking';
  }
};

export default MultiRouteManager;