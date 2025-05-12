import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '../types';
import { useToast } from '@/hooks/use-toast';

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
  const [mapboxToken, setMapboxToken] = useState<string>('');
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
    // Try to get token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;
    
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
  }, [mapboxToken]);

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

  // If no token is available, show input form
  if (!mapboxToken) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Clé API Mapbox Requise</h2>
          <p className="text-gray-600 mb-4">
            Veuillez saisir votre clé API publique Mapbox. Vous pouvez la trouver dans votre tableau de bord Mapbox.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
