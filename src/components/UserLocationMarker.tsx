
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface UserLocationMarkerProps {
  location: [number, number];
  map: mapboxgl.Map;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ location, map }) => {
  React.useEffect(() => {
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location';
    userMarkerEl.innerHTML = `
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-md hover:shadow-lg">
        <div class="h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-500 text-xs font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      </div>
    `;
    
    const marker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat(location)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3 class="font-medium">Votre position</h3>`))
      .addTo(map);
    
    return () => {
      marker.remove();
    };
  }, [location, map]);

  return null; // This component doesn't render anything directly
};

export default UserLocationMarker;
