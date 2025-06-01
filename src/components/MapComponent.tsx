import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// Removed "mapbox-gl/dist/mapbox-gl.css" import as it's now loaded via CDN
import { Place, TransportMode } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import UserLocationMarker from './UserLocationMarker';
import MapMarker from './MapMarker';
import RadiusCircle from './RadiusCircle';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { useTranslation } from 'react-i18next';

interface MapComponentProps {
  center: [number, number] | null;
  results: Place[];
  transportMode: TransportMode;
  radius: number;
  unit: 'km' | 'mi';
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  center, 
  results, 
  transportMode,
  radius, 
  unit 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      try {
        console.log('Initializing map with token:', mapboxToken.substring(0, 20) + '...');
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: center || [2.35, 48.85], // Default to Paris if no center provided
          zoom: isMobile ? 10 : 12 // Smaller zoom on mobile
        });
        
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Set map as loaded when it's ready
        newMap.on('load', () => {
          console.log('Map loaded successfully');
          setMapLoaded(true);
        });
        
        newMap.on('error', (e) => {
          console.error('Map error:', e);
          toast({
            title: t("map.error"),
            description: t("map.errorLoading"),
            variant: "destructive",
          });
        });
        
        map.current = newMap;
      } catch (error) {
        console.error('Error initializing Mapbox map:', error);
        toast({
          title: t("map.initError"),
          description: t("map.initErrorDesc"),
          variant: "destructive",
        });
      }
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, isMobile, toast, t]);

  // Update bounds to fit all markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !results.length || !center) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(center);
      
      // Add all results to bounds
      results.forEach(place => {
        bounds.extend(place.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: isMobile ? { top: 50, bottom: 50, left: 20, right: 20 } : 50,
        maxZoom: isMobile ? 13 : 15
      });
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [results, mapLoaded, center, isMobile]);

  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div ref={mapContainer} className="h-full w-full">
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Render markers only when map and data are ready */}
      {mapLoaded && map.current && (
        <>
          {center && (
            <>
              <UserLocationMarker location={center} map={map.current} />
              <RadiusCircle 
                center={center} 
                radius={radius} 
                unit={unit} 
                map={map.current} 
                mapLoaded={mapLoaded} 
              />
            </>
          )}
          
          {results.map(place => (
            <MapMarker key={place.id} place={place} map={map.current!} />
          ))}
        </>
      )}
    </div>
  );
};

export default MapComponent;
