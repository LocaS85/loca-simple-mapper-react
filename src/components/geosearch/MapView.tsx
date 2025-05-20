
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGeoSearch } from '@/hooks/use-geo-search';
import { useTranslation } from 'react-i18next';
import MultiMapToggle from './MultiMapToggle';

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
  const { t } = useTranslation();
  
  // Get user location from the GeoSearch hook
  const { userLocation } = useGeoSearch({});

  console.log('MapView rendering with results:', results);
  console.log('MapView rendering with userLocation:', userLocation);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    try {
      console.log('Initializing map with center:', userLocation || [2.35, 48.85]);
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation || [2.35, 48.85], // Use user location or Paris as default
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
        title: t("map.error"),
        description: t("map.errorLoading"),
        variant: "destructive",
      });
    }
  }, [isMobile, toast, userLocation, t]);

  // Fit map to bounds when results change
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(userLocation);
      
      // Add all results to bounds if there are any
      if (results.length > 0) {
        console.log('Extending bounds with results:', results);
        results.forEach(place => {
          bounds.extend(place.coordinates);
        });
        
        map.current.fitBounds(bounds, {
          padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
          maxZoom: isMobile ? 13 : 15
        });
      } else {
        // If no results, center on user location
        console.log('No results, centering on user location');
        map.current.setCenter(userLocation);
        map.current.setZoom(isMobile ? 10 : 12);
      }
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [results, mapLoaded, userLocation, isMobile]);

  // Update markers when results change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    console.log('Updating markers with results:', results);
    
    // Clear existing markers
    const markerElements = document.querySelectorAll('.mapboxgl-marker');
    markerElements.forEach(marker => {
      marker.remove();
    });
    
    // Add user location marker
    if (userLocation) {
      console.log('Adding user location marker');
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${t('geosearch.yourPosition')}</h3>
          </div>
        `))
        .addTo(map.current);
    }
    
    // Add result markers
    results.forEach(place => {
      console.log('Adding marker for place:', place);
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(place.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${place.name}</h3>
            <p>${place.address}</p>
            <p>${t('map.distance')}: ${place.distance} ${place.distance > 1 ? 'km' : 'm'}</p>
            <p>${t('map.duration')}: ${place.duration} min</p>
          </div>
        `))
        .addTo(map.current);
    });
    
  }, [results, mapLoaded, userLocation, t]);

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
      </div>
    </div>
  );
};

export default MapView;
