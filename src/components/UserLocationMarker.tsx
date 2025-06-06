
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface UserLocationMarkerProps {
  location: [number, number];
  map: mapboxgl.Map;
  accuracy?: number;
  showAccuracy?: boolean;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ 
  location, 
  map, 
  accuracy,
  showAccuracy = false 
}) => {
  React.useEffect(() => {
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    
    // Create pulsing marker with better styling
    userMarkerEl.innerHTML = `
      <div class="relative flex h-10 w-10 items-center justify-center">
        <div class="absolute h-10 w-10 rounded-full bg-blue-500 opacity-75 animate-ping"></div>
        <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:shadow-xl transition-shadow">
          <div class="h-6 w-6 rounded-full bg-white flex items-center justify-center">
            <div class="h-3 w-3 rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>
    `;
    
    // Create popup content
    const popupContent = `
      <div class="p-3 min-w-[150px]">
        <h3 class="font-medium text-sm mb-2">Votre position</h3>
        <div class="text-xs text-gray-500 space-y-1">
          <p>Lat: ${location[1].toFixed(6)}</p>
          <p>Lng: ${location[0].toFixed(6)}</p>
          ${accuracy && showAccuracy ? `<p>Précision: ${Math.round(accuracy)}m</p>` : ''}
        </div>
      </div>
    `;
    
    const marker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat(location)
      .setPopup(new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent))
      .addTo(map);
    
    return () => {
      marker.remove();
    };
  }, [location, map, accuracy, showAccuracy]);

  return null; // This component doesn't render anything directly
};

export default UserLocationMarker;
