
import React, { useEffect, useRef } from 'react';
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Vérifier que la carte est prête et chargée
    if (!map || !map.isStyleLoaded()) {
      console.log('⏳ Carte non prête pour les marqueurs');
      return;
    }
    
    // Nettoyer les marqueurs existants
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('⚠️ Erreur lors du retrait du marqueur:', error);
      }
    });
    markersRef.current = [];
    
    try {
      // Ajouter le marqueur de position utilisateur
      if (userLocation) {
        const userMarkerElement = document.createElement('div');
        userMarkerElement.className = 'user-location-marker';
        userMarkerElement.innerHTML = `
          <div class="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `;

        const userMarker = new mapboxgl.Marker(userMarkerElement)
          .setLngLat(userLocation)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-sm text-blue-600">${t('geosearch.yourPosition')}</h3>
              <p class="text-xs text-gray-500 mt-1">Votre localisation actuelle</p>
            </div>
          `));

        // Vérifier que la carte existe avant d'ajouter
        if (map && map.getContainer()) {
          userMarker.addTo(map);
          markersRef.current.push(userMarker);
          console.log('📍 Marqueur utilisateur ajouté');
        }
      }
      
      // Ajouter les marqueurs de résultats
      results.forEach((place, index) => {
        if (!place.coordinates) return;
        
        const resultMarkerElement = document.createElement('div');
        resultMarkerElement.className = 'result-marker cursor-pointer';
        resultMarkerElement.innerHTML = `
          <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-xs font-bold">${index + 1}</span>
          </div>
        `;

        const resultMarker = new mapboxgl.Marker(resultMarkerElement)
          .setLngLat(place.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-sm mb-2">${place.name}</h3>
              <p class="text-xs text-gray-600 mb-2">${place.address}</p>
              <div class="flex justify-between text-xs">
                <span class="text-blue-600">📏 ${place.distance} km</span>
                <span class="text-green-600">⏱️ ${place.duration || '~'} min</span>
              </div>
              ${onRouteRequest ? `
                <button 
                  class="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                  onclick="window.showRouteToPlace('${place.id}')"
                >
                  Voir l'itinéraire
                </button>
              ` : ''}
            </div>
          `));

        // Vérifier que la carte existe avant d'ajouter
        if (map && map.getContainer()) {
          resultMarker.addTo(map);
          markersRef.current.push(resultMarker);
        }
      });

      // Ajouter la fonction globale pour afficher l'itinéraire
      if (onRouteRequest) {
        (window as any).showRouteToPlace = (placeId: string) => {
          onRouteRequest(placeId);
        };
      }

      console.log(`✅ ${markersRef.current.length} marqueurs ajoutés`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout des marqueurs:', error);
    }
    
    // Nettoyage à la destruction
    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('⚠️ Erreur lors du nettoyage des marqueurs:', error);
        }
      });
      markersRef.current = [];
    };
  }, [map, userLocation, results, t, onRouteRequest]);

  return null;
};

export default MapMarkers;
