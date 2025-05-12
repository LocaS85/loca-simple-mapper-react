
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place, TransportMode } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import UserLocationMarker from './UserLocationMarker';
import MapMarker from './MapMarker';
import RadiusCircle from './RadiusCircle';
import { getMapboxToken, isMapboxTokenValid, MapboxErrorMessage } from '@/utils/mapboxConfig';

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

  // Définir le token Mapbox
  const mapboxToken = getMapboxToken();

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center || [2.35, 48.85], // Default to Paris if no center provided
        zoom: isMobile ? 10 : 12 // Smaller zoom on mobile
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Set map as loaded when it's ready
      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, isMobile]);

  // Update bounds to fit all markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !results.length || !center) return;
    
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
  }, [results, mapLoaded, center, isMobile]);

  if (!isMapboxTokenValid()) {
    return <MapboxErrorMessage />;
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
