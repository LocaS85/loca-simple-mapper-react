
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place, TransportMode } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

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
  transportMode,
  radius, 
  unit 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Function to handle token input
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
      toast({
        title: 'Token sauvegardé',
        description: 'Votre token Mapbox a été enregistré avec succès.',
      });
    }
  };

  useEffect(() => {
    // Try to get token from localStorage or environment variable
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center || [2.35, 48.85], // Default to Paris if no center provided
        zoom: isMobile ? 10 : 12 // Smaller zoom on mobile
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Set map as loaded when it's ready
      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, center, isMobile]);

  // Update markers when results change
  useEffect(() => {
    if (!map.current || !mapLoaded || !results.length) return;
    
    // Remove existing markers except the user location marker
    const markers = document.querySelectorAll('.mapboxgl-marker:not(.user-location)');
    markers.forEach(marker => marker.remove());
    
    // Add user location marker if we have center coordinates
    if (center) {
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
      
      // Add radius circle around user location
      if (map.current.getSource('radius')) {
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
      } else {
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
            'circle-color': '#4299e1',
            'circle-opacity': 0.15,
            'circle-stroke-color': '#4299e1',
            'circle-stroke-width': 1
          }
        });
      }
      
      new mapboxgl.Marker(userMarkerEl)
        .setLngLat(center)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 class="font-medium">Votre position</h3>`))
        .addTo(map.current);
    }
    
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
        padding: isMobile ? { top: 50, bottom: 50, left: 20, right: 20 } : 50,
        maxZoom: isMobile ? 13 : 15
      });
    }
  }, [results, mapLoaded, center, radius, unit, isMobile]);

  // If no token is available, show input form
  if (!mapboxToken) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4 md:p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Clé API Mapbox Requise</h2>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Veuillez saisir votre clé API publique Mapbox. Vous pouvez la trouver dans votre tableau de bord Mapbox.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Clé API Mapbox
              </label>
              <input
                type="text"
                id="token"
                name="token"
                required
                placeholder="pk.eyJ1IjoieW91..."
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enregistrer la clé
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
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
