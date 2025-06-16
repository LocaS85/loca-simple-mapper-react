
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '../types';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';

interface MapProps {
  locations?: Location[];
  selectedLocationId?: string;
  onSelectLocation?: (locationId: string) => void;
}

const Map: React.FC<MapProps> = ({ 
  locations = [],
  selectedLocationId,
  onSelectLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris by default
      zoom: 11
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded || locations.length === 0) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add new markers
    locations.forEach((location) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `
        <div class="${selectedLocationId === location.id ? 'bg-locasimple-blue' : 'bg-locasimple-teal'} p-2 rounded-full shadow-md cursor-pointer transform transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;
      
      el.addEventListener('click', () => {
        if (onSelectLocation) {
          onSelectLocation(location.id);
        }
      });
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .addTo(map.current!);
      
      markers.current[location.id] = marker;
    });
  }, [locations, mapLoaded, selectedLocationId, onSelectLocation]);
  
  // Center on selected location
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocationId) return;
    
    const location = locations.find(loc => loc.id === selectedLocationId);
    if (location) {
      map.current.flyTo({
        center: location.coordinates,
        zoom: 14,
        essential: true
      });
    }
  }, [selectedLocationId, locations, mapLoaded]);

  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
