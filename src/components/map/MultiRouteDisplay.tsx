
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import { TransportMode } from '@/types/map';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

const modeColors: Record<TransportMode, string> = {
  driving: '#1976D2',
  walking: '#43A047',
  cycling: '#FB8C00',
  bus: '#8E24AA',
  train: '#EF4444',
  transit: '#8E24AA'
};

// Service pour obtenir les routes pour tous les modes de transport
const getRoutesForAllModes = async (start: LngLatLike, end: LngLatLike) => {
  const modes: TransportMode[] = ['driving', 'walking', 'cycling'];
  const routes = [];

  for (const mode of modes) {
    try {
      const profile = mode === 'driving' ? 'driving' : mode;
      
      // Normaliser les coordonnées en format lng,lat
      const startCoords = normalizeCoordinates(start);
      const endCoords = normalizeCoordinates(end);
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startCoords.join(',')};${endCoords.join(',')}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          routes.push({
            mode,
            route: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: data.routes[0].geometry,
                properties: { mode }
              }]
            }
          });
        }
      }
    } catch (error) {
      console.error(`Erreur pour le mode ${mode}:`, error);
    }
  }

  return routes;
};

// Fonction pour normaliser les coordonnées
const normalizeCoordinates = (coords: LngLatLike): [number, number] => {
  if (Array.isArray(coords)) {
    return coords as [number, number];
  }
  
  // Type guard pour mapboxgl.LngLat ou similaire
  if (typeof coords === 'object' && coords !== null) {
    if ('lng' in coords && 'lat' in coords) {
      return [coords.lng, coords.lat];
    }
    
    if ('lon' in coords && 'lat' in coords) {
      return [(coords as any).lon, (coords as any).lat];
    }
  }
  
  // Fallback
  return [0, 0];
};

const MultiRouteDisplay: React.FC = () => {
  const mapRef = useRef<MapboxMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { filters, results } = useGeoSearchManager();
  const [routes, setRoutes] = useState<any[]>([]);

  const start = filters.coordinates as LngLatLike;
  const end = results.length > 0 ? results[0].coordinates as LngLatLike : null;

  useEffect(() => {
    if (!start || !end || !mapRef.current) return;

    const fetchRoutes = async () => {
      try {
        const result = await getRoutesForAllModes(start, end);
        setRoutes(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des routes:', error);
      }
    };

    fetchRoutes();
  }, [start, end]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: start || [2.3522, 48.8566],
      zoom: 13,
    });

    mapRef.current = map;

    if (start) {
      new mapboxgl.Marker({ color: '#4CAF50' })
        .setLngLat(start)
        .addTo(map);
    }

    if (end) {
      new mapboxgl.Marker({ color: '#F44336' })
        .setLngLat(end)
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [start, end]);

  useEffect(() => {
    if (!mapRef.current || !routes.length) return;

    const map = mapRef.current;

    routes.forEach(({ mode, route }) => {
      const routeId = `route-${mode}`;

      if (map.getSource(routeId)) {
        (map.getSource(routeId) as mapboxgl.GeoJSONSource).setData(route);
      } else {
        map.addSource(routeId, {
          type: 'geojson',
          data: route,
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
            'line-color': modeColors[mode] || '#000000',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        });
      }
    });

    if (start && end) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(start);
      bounds.extend(end);
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [routes]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[60vh] rounded-xl shadow-md bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Token Mapbox manquant</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[60vh] rounded-xl shadow-md overflow-hidden" id="geo-map-container">
      <div ref={containerRef} className="w-full h-full" />
      {routes.length > 0 && (
        <div className="absolute top-2 left-2 bg-white p-2 rounded shadow-md">
          <div className="text-sm font-semibold mb-1">Modes de transport:</div>
          {routes.map(({ mode }) => (
            <div key={mode} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-1 rounded"
                style={{ backgroundColor: modeColors[mode] }}
              />
              <span className="capitalize">
                {mode === 'driving' ? 'Voiture' : mode === 'walking' ? 'Marche' : 'Vélo'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiRouteDisplay;
