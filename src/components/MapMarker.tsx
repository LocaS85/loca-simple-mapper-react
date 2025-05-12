
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '../types';

interface MapMarkerProps {
  place: Place;
  map: mapboxgl.Map;
}

const MapMarker: React.FC<MapMarkerProps> = ({ place, map }) => {
  React.useEffect(() => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200">
        <div class="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
          ${place.category === 'restaurant' ? '🍽️' : place.category === 'cafe' ? '☕' : '📍'}
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
