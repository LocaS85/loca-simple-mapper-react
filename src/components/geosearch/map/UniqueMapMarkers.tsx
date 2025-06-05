
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface UniqueMapMarkersProps {
  map: mapboxgl.Map;
  userLocation: [number, number] | null;
  results: SearchResult[];
  onRouteRequest?: (placeId: string) => void;
}

const UniqueMapMarkers: React.FC<UniqueMapMarkersProps> = ({ 
  map, 
  userLocation, 
  results, 
  onRouteRequest 
}) => {
  const { t } = useTranslation();
  const markersRef = useRef<{
    user?: mapboxgl.Marker;
    results: Map<string, mapboxgl.Marker>;
  }>({
    results: new Map()
  });

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) {
      console.log('⏳ Carte non prête pour les marqueurs');
      return;
    }

    // Nettoyer tous les marqueurs existants
    if (markersRef.current.user) {
      markersRef.current.user.remove();
      markersRef.current.user = undefined;
    }
    
    markersRef.current.results.forEach(marker => {
      marker.remove();
    });
    markersRef.current.results.clear();

    try {
      // Ajouter le marqueur de position utilisateur (unique)
      if (userLocation) {
        const userMarkerElement = document.createElement('div');
        userMarkerElement.className = 'user-location-marker';
        userMarkerElement.innerHTML = `
          <div class="relative">
            <div class="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div class="absolute w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-ping -top-2 -left-2"></div>
          </div>
        `;

        const userMarker = new mapboxgl.Marker(userMarkerElement)
          .setLngLat(userLocation)
          .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
            <div class="p-3 flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-sm text-blue-600">Ma position</h3>
                <p class="text-xs text-gray-500">Localisation actuelle</p>
              </div>
            </div>
          `))
          .addTo(map);

        markersRef.current.user = userMarker;
        console.log('📍 Marqueur utilisateur ajouté');
      }
      
      // Ajouter les marqueurs de résultats (éviter les doublons)
      const addedPositions = new Set<string>();
      
      results.forEach((place, index) => {
        if (!place.coordinates) return;
        
        // Créer une clé unique pour la position
        const positionKey = `${place.coordinates[0].toFixed(6)}_${place.coordinates[1].toFixed(6)}`;
        
        // Éviter les doublons de position
        if (addedPositions.has(positionKey)) {
          console.log(`⚠️ Position dupliquée ignorée pour: ${place.name}`);
          return;
        }
        
        addedPositions.add(positionKey);
        
        const resultMarkerElement = document.createElement('div');
        resultMarkerElement.className = 'result-marker cursor-pointer';
        resultMarkerElement.innerHTML = `
          <div class="relative">
            <div class="w-7 h-7 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
              <span class="text-white text-xs font-bold">${index + 1}</span>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3 min-w-[200px] max-w-[280px]">
            <h3 class="font-bold text-sm mb-2 text-gray-800">${place.name}</h3>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">${place.address}</p>
            <div class="flex justify-between text-xs mb-3">
              <span class="text-blue-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                ${place.distance} km
              </span>
              <span class="text-green-600 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                ${place.duration || '~'} min
              </span>
            </div>
            ${onRouteRequest ? `
              <button 
                class="w-full bg-blue-500 text-white text-xs py-2 px-3 rounded hover:bg-blue-600 transition-colors font-medium"
                onclick="window.showRouteToPlace('${place.id}')"
              >
                📍 Voir l'itinéraire
              </button>
            ` : ''}
          </div>
        `);

        const resultMarker = new mapboxgl.Marker(resultMarkerElement)
          .setLngLat(place.coordinates)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.results.set(place.id, resultMarker);
      });

      // Ajouter la fonction globale pour afficher l'itinéraire
      if (onRouteRequest) {
        (window as any).showRouteToPlace = (placeId: string) => {
          onRouteRequest(placeId);
        };
      }

      console.log(`✅ ${markersRef.current.results.size + (markersRef.current.user ? 1 : 0)} marqueurs uniques ajoutés`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout des marqueurs:', error);
    }
    
    // Nettoyage à la destruction
    return () => {
      if (markersRef.current.user) {
        markersRef.current.user.remove();
        markersRef.current.user = undefined;
      }
      
      markersRef.current.results.forEach(marker => {
        marker.remove();
      });
      markersRef.current.results.clear();
    };
  }, [map, userLocation, results, t, onRouteRequest]);

  return null;
};

export default UniqueMapMarkers;
