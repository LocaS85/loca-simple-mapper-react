
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
    // Create marker element safely without innerHTML
    const el = document.createElement('div');
    el.className = 'marker cursor-pointer hover:scale-110 transition-transform duration-200';
    
    // Create container div
    const container = document.createElement('div');
    container.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg';
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold';
    
    // Set background color based on category
    switch (place.category) {
      case 'restaurant':
        iconContainer.className += ' bg-red-500';
        iconContainer.innerHTML = '🍽️';
        break;
      case 'cafe':
        iconContainer.className += ' bg-purple-500';
        iconContainer.innerHTML = '☕';
        break;
      default:
        iconContainer.className += ' bg-blue-500';
        iconContainer.innerHTML = '📍';
    }
    
    container.appendChild(iconContainer);
    el.appendChild(container);
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(place.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-medium text-sm mb-1">${place.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${place.address}</p>
            <div class="flex justify-between text-xs">
              <span class="text-blue-600">📏 ${place.distance || 'N/A'} km</span>
              <span class="text-green-600">⏱️ ${place.duration || 'N/A'} min</span>
            </div>
          </div>
        `))
      .addTo(map);
    
    return () => {
      marker.remove();
    };
  }, [place, map]);

  return null;
};

export default MapMarker;
