
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface MapMarkersProps {
  map: mapboxgl.Map;
  userLocation: [number, number] | null;
  results: SearchResult[];
  onRouteRequest?: (placeId: string) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  map, 
  userLocation, 
  results, 
  onRouteRequest 
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!map) return;
    
    // Effacer les marqueurs existants
    const markerElements = document.querySelectorAll('.mapboxgl-marker');
    markerElements.forEach(marker => {
      marker.remove();
    });
    
    // Ajouter le marqueur de position utilisateur
    if (userLocation) {
      new mapboxgl.Marker({ color: '#3b82f6', scale: 1.2 })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-sm">${t('geosearch.yourPosition')}</h3>
            <p class="text-xs text-gray-500 mt-1">Votre localisation actuelle</p>
          </div>
        `))
        .addTo(map);
    }
    
    // Ajouter les marqueurs de résultats
    results.forEach((place) => {
      new mapboxgl.Marker({ color: '#ef4444', scale: 1.0 })
        .setLngLat(place.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-sm mb-2">${place.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${place.address}</p>
            <div class="flex justify-between text-xs">
              <span class="text-blue-600">📏 ${place.distance} km</span>
              <span class="text-green-600">⏱️ ${place.duration || '~'} min</span>
            </div>
            <button 
              class="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
              onclick="window.showRouteToPlace('${place.id}')"
            >
              Voir l'itinéraire
            </button>
          </div>
        `))
        .addTo(map);
      
      // Ajouter la fonction globale pour afficher l'itinéraire
      (window as any).showRouteToPlace = (placeId: string) => {
        if (onRouteRequest) {
          onRouteRequest(placeId);
        }
      };
    });
    
  }, [map, userLocation, results, t, onRouteRequest]);

  return null;
};

export default MapMarkers;
