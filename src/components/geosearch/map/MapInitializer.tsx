
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getMapboxTokenSync, isMapboxTokenValidSync } from '@/utils/mapboxConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { MAP_CONFIG } from './MapConfig';
import MapControls from './MapControls';

interface MapInitializerProps {
  userLocation: [number, number] | null;
  isMapboxReady: boolean;
  onMapLoad: (map: mapboxgl.Map) => void;
  onError: (error: string) => void;
  onLocationUpdate: (coords: [number, number]) => void;
  children?: React.ReactNode;
}

export const MapInitializer: React.FC<MapInitializerProps> = ({
  userLocation,
  isMapboxReady,
  onMapLoad,
  onError,
  onLocationUpdate,
  children
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      if (!isMapboxTokenValidSync()) {
        onError('Token Mapbox invalide');
        return;
      }

      const mapboxToken = getMapboxTokenSync();
      if (!mapboxToken) {
        onError('Token Mapbox manquant');
        return;
      }
      
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_CONFIG.defaultStyle,
        center: userLocation || MAP_CONFIG.defaultCenter,
        zoom: isMobile ? MAP_CONFIG.defaultZoom.mobile : MAP_CONFIG.defaultZoom.desktop,
        attributionControl: false
      });
      
      newMap.on('load', () => {
        setMapLoaded(true);
        
        // Add route source and layer
        newMap.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        newMap.addLayer(MAP_CONFIG.routeLayerConfig);
        
        onMapLoad(newMap);
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Erreur de carte:', e);
        onError('Erreur de chargement de la carte');
      });
      
      map.current = newMap;
      
      return () => {
        map.current?.remove();
        map.current = null;
        setMapLoaded(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      onError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, userLocation, isMapboxReady, onMapLoad, onError]);

  return (
    <div ref={mapContainer} className="relative w-full h-full">
      {mapLoaded && map.current && (
        <>
          <MapControls 
            map={map.current} 
            onLocationUpdate={onLocationUpdate}
          />
          {children}
        </>
      )}
    </div>
  );
};

export default MapInitializer;
