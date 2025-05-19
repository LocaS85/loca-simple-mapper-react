
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import UserLocationMarker from '@/components/UserLocationMarker';
import MapMarker from '@/components/MapMarker';
import RadiusCircle from '@/components/RadiusCircle';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGeoSearch } from '@/hooks/use-geo-search';

interface MapViewProps {
  results: SearchResult[];
  isLoading: boolean;
  transport: TransportMode;
}

const MapView: React.FC<MapViewProps> = ({ results, isLoading, transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Obtenir l'emplacement de l'utilisateur depuis le hook useGeoSearch
  const { userLocation } = useGeoSearch({});

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation || [2.35, 48.85], // Utiliser l'emplacement de l'utilisateur ou Paris par défaut
        zoom: isMobile ? 10 : 12
      });
      
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });
      
      map.current = newMap;
      
      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte",
        variant: "destructive",
      });
    }
  }, [isMobile, toast, userLocation]);

  // Fit map to bounds when results change
  useEffect(() => {
    if (!map.current || !mapLoaded || !results.length || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(userLocation);
      
      // Add all results to bounds
      results.forEach(place => {
        bounds.extend(place.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
        maxZoom: isMobile ? 13 : 15
      });
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [results, mapLoaded, userLocation, isMobile]);

  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="w-full h-full pt-24 pb-16">
      <div ref={mapContainer} className="relative w-full h-full">
        {/* Loading indicator */}
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <LoadingSpinner />
          </div>
        )}
        
        {/* Render markers when map and data are ready */}
        {mapLoaded && map.current && (
          <>
            {userLocation && (
              <>
                <UserLocationMarker location={userLocation} map={map.current} />
                <RadiusCircle 
                  center={userLocation} 
                  radius={5} // Default radius
                  unit="km" 
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
    </div>
  );
};

export default MapView;
