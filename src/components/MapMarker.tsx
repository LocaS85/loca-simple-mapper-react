
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';

interface MapMarkerProps {
  place: SearchResult;
  map: mapboxgl.Map;
  onClick?: (place: SearchResult) => void;
  color?: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({ 
  place, 
  map, 
  onClick,
  color 
}) => {
  React.useEffect(() => {
    // Create marker element with improved styling
    const el = document.createElement('div');
    el.className = 'map-marker cursor-pointer hover:scale-110 transition-transform duration-200';
    
    // Determine marker color based on category
    const markerColor = color || getColorForCategory(place.category || '');
    
    // Create marker content
    el.innerHTML = `
      <div class="relative flex h-8 w-8 items-center justify-center">
        <div class="flex h-8 w-8 items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-shadow" 
             style="background-color: ${markerColor}">
          <div class="text-white text-sm font-bold">
            ${getCategoryIcon(place.category || '')}
          </div>
        </div>
      </div>
    `;
    
    // Create detailed popup content
    const popupContent = `
      <div class="p-3 min-w-[250px] max-w-[350px]">
        <h3 class="font-semibold text-base mb-2 line-clamp-2">${place.name}</h3>
        ${place.address ? `<p class="text-sm text-gray-600 mb-3 line-clamp-2">${place.address}</p>` : ''}
        <div class="flex items-center justify-between text-sm">
          ${place.distance ? `<span class="text-blue-600 font-medium">📏 ${place.distance} km</span>` : ''}
          ${place.duration ? `<span class="text-green-600 font-medium">⏱️ ${place.duration} min</span>` : ''}
        </div>
        ${place.category ? `
          <div class="mt-2 pt-2 border-t border-gray-200">
            <span class="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              ${place.category}
            </span>
          </div>
        ` : ''}
      </div>
    `;
    
    // Add click handler
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onClick) {
        onClick(place);
      }
    });
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(place.coordinates)
      .setPopup(new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '350px'
      }).setHTML(popupContent))
      .addTo(map);
    
    return () => {
      marker.remove();
    };
  }, [place, map, onClick, color]);

  return null;
};

// Helper functions
const getColorForCategory = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'restaurant':
    case 'food':
      return '#e67e22';
    case 'health':
    case 'santé':
      return '#27ae60';
    case 'entertainment':
    case 'divertissement':
      return '#8e44ad';
    case 'shopping':
      return '#f39c12';
    case 'hotel':
    case 'lodging':
      return '#3498db';
    default:
      return '#3498db';
  }
};

const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'restaurant':
    case 'food':
      return '🍽️';
    case 'health':
    case 'santé':
      return '🏥';
    case 'entertainment':
    case 'divertissement':
      return '🎭';
    case 'shopping':
      return '🛍️';
    case 'hotel':
    case 'lodging':
      return '🏨';
    default:
      return '📍';
  }
};

export default MapMarker;
