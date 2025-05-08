
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place, TransportMode } from '../types';

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
  radius, 
  unit 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Function to handle token input
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
    }
  };

  useEffect(() => {
    // Try to get token from localStorage or environment variable
    const savedToken = localStorage.getItem('mapbox_token') || import.meta.env.VITE_MAPBOX_TOKEN;
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !center) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add user location marker
    if (center) {
      const el = document.createElement('div');
      el.className = 'flex h-6 w-6 items-center justify-center';
      el.innerHTML = `
        <div class="h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white"></div>
      `;
      
      new mapboxgl.Marker(el)
        .setLngLat(center)
        .addTo(map.current);
    }
    
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add circle showing search radius
      if (center && map.current) {
        const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
        
        map.current.addSource('radius', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: center
            },
            properties: {
              radius: radiusInMeters
            }
          }
        });
        
        map.current.addLayer({
          id: 'radius-circle',
          type: 'circle',
          source: 'radius',
          paint: {
            'circle-radius': ['get', 'radius'],
            'circle-color': '#4287f5',
            'circle-opacity': 0.2,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#4287f5',
            'circle-stroke-opacity': 0.6,
            'circle-radius-units': 'meters'
          }
        });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, center]);

  // Update markers when results change
  useEffect(() => {
    if (!map.current || !mapLoaded || !results.length) return;
    
    // Remove existing markers except the user location marker
    const markers = document.querySelectorAll('.mapboxgl-marker:not(.user-location)');
    markers.forEach(marker => marker.remove());
    
    // Add result markers
    results.forEach(place => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200">
          <div class="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            ${place.category === 'restaurant' ? '🍽️' : place.category === 'cafe' ? '☕' : '📍'}
          </div>
        </div>
      `;
      
      new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 class="font-medium">${place.name}</h3><p class="text-xs text-gray-500">${place.address}</p>`))
        .addTo(map.current!);
    });
    
    // Fit bounds to include all markers if there are results
    if (results.length > 0 && center) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(center);
      
      // Add all results to bounds
      results.forEach(place => {
        bounds.extend(place.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [results, mapLoaded]);
  
  // Update radius circle when radius or unit changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !center) return;
    
    const source = map.current.getSource('radius');
    if (source && 'setData' in source) {
      const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
      source.setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center
        },
        properties: {
          radius: radiusInMeters
        }
      });
    }
  }, [radius, unit, mapLoaded]);

  // If no token is available, show input form
  if (!mapboxToken) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mapbox Token Required</h2>
          <p className="text-gray-600 mb-4">
            Please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Mapbox Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                required
                placeholder="pk.eyJ1IjoieW91..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Token
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="h-full w-full">
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
