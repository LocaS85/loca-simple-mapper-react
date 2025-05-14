
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '../types';
import { Utensils, Coffee, MapPin } from 'lucide-react';

interface MapMarkerProps {
  place: Place;
  map: mapboxgl.Map;
}

const MapMarker: React.FC<MapMarkerProps> = ({ place, map }) => {
  React.useEffect(() => {
    const el = document.createElement('div');
    el.className = 'marker';
    
    // Create a safe HTML structure without emoji icons
    el.innerHTML = `
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200">
        <div class="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
          ${place.category === 'restaurant' ? 
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 19H21M3 5H21M4 9H8M4 14H8M9 9H13M9 14H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : 
            place.category === 'cafe' ? 
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 8H18C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16H17M2 8H17V16H2V8ZM6 20V16M12 20V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : 
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10C20 14.4183 12 22 12 22C12 22 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          }
        </div>
      </div>
    `;
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(place.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3 class="font-medium">${place.name}</h3><p class="text-xs text-gray-500">${place.address}</p>`))
      .addTo(map);
    
    return () => {
      marker.remove();
    };
  }, [place, map]);

  return null; // This component doesn't render anything directly
};

export default MapMarker;
