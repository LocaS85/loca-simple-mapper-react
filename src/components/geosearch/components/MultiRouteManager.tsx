import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { getDirections } from '@/utils/mapboxSdk';
import { TRANSPORT_COLORS } from './GoogleMapsMap';
import { routeCache } from '@/services/RouteCache';
import { routeOptimizer } from '@/services/RouteOptimizer';


interface MultiRouteManagerProps {
  map: mapboxgl.Map;
  userLocation: [number, number] | null;
  results: SearchResult[];
  transport: string;
  showMultiDirections?: boolean;
  onProgressUpdate?: (current: number, total: number) => void;
}

const MultiRouteManager: React.FC<MultiRouteManagerProps> = ({
  map,
  userLocation,
  results,
  transport,
  showMultiDirections = false,
  onProgressUpdate
}) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  useEffect(() => {
    if (!map || !userLocation || results.length === 0 || !showMultiDirections) {
      setIsCalculating(false);
      return;
    }

    const loadRoutes = async () => {
      // Annuler les requêtes précédentes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Créer un nouveau contrôleur d'annulation
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsCalculating(true);
      
      // Nettoyer les anciennes routes
      clearExistingRoutes(map);

      // Optimiser le nombre de routes selon les performances
      const optimalCount = routeOptimizer.getOptimalRouteCount(results.length);
      const limitedResults = results.slice(0, optimalCount);
      const shouldDelay = routeOptimizer.shouldLimitConcurrentRequests();
      const requestDelay = routeOptimizer.getRequestDelay();

      onProgressUpdate?.(0, limitedResults.length);

      for (let i = 0; i < limitedResults.length; i++) {
        if (signal.aborted) break;
        
        const result = limitedResults[i];
        onProgressUpdate?.(i + 1, limitedResults.length);
        
        try {
          // Vérifier le cache d'abord
          const cachedRoute = routeCache.get(userLocation, result.coordinates, transport);
          
          let route;
          if (cachedRoute) {
            route = cachedRoute;
          } else {
            // Délai entre les requêtes si nécessaire
            if (shouldDelay && i > 0) {
              await new Promise(resolve => setTimeout(resolve, requestDelay));
            }
            
            if (signal.aborted) break;
            
            // Mapper le transport vers le profil Mapbox
            const mapboxProfile = getMapboxProfile(transport);
            
            const routeData = await getDirections(
              userLocation,
              result.coordinates,
              mapboxProfile
            );

            if (routeData.routes && routeData.routes.length > 0) {
              route = routeData.routes[0];
              
              // Mettre en cache
              routeCache.set(userLocation, result.coordinates, transport, route);
            }
          }

          if (route && !signal.aborted) {
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
          if (signal.aborted) break;
          console.error(`Erreur calcul route pour ${result.name}:`, error);
        }
      }
      
      setIsCalculating(false);
      onProgressUpdate?.(0, 0);
    };

    loadRoutes();

    return () => {
      // Annuler les requêtes en cours
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearExistingRoutes(map);
      setIsCalculating(false);
    };
  }, [map, userLocation, results, transport, showMultiDirections, onProgressUpdate]);

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