
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';
import { mapboxApiService } from '@/services/mapboxApiService';

interface UniqueMapMarkersProps {
  map: mapboxgl.Map;
  userLocation: [number, number] | null;
  results: SearchResult[];
  onRouteRequest: (placeId: string) => void;
}

const UniqueMapMarkers: React.FC<UniqueMapMarkersProps> = ({
  map,
  userLocation,
  results,
  onRouteRequest
}) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeSourceAdded = useRef(false);

  // Nettoyer les marqueurs existants
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Erreur lors de la suppression du marqueur:', error);
      }
    });
    markersRef.current = [];
    
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      } catch (error) {
        console.warn('Erreur lors de la suppression du marqueur utilisateur:', error);
      }
    }
  };

  // Vérifier si la carte est prête
  const isMapReady = () => {
    return map && map.isStyleLoaded && map.isStyleLoaded() && map.getContainer();
  };

  // Initialiser la source et le layer de route
  useEffect(() => {
    if (!isMapReady() || routeSourceAdded.current) return;

    try {
      if (!map.getSource('route-line')) {
        map.addSource('route-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3B82F6',
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 8],
            'line-opacity': 0.8
          }
        });

        routeSourceAdded.current = true;
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la source de route:', error);
    }
  }, [map]);

  // Créer le marqueur utilisateur avec icône personnalisée
  useEffect(() => {
    if (!isMapReady() || !userLocation) {
      console.log('⏳ Carte non prête ou pas de position utilisateur');
      return;
    }

    // Supprimer l'ancien marqueur utilisateur s'il existe
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      } catch (error) {
        console.warn('Erreur lors de la suppression de l\'ancien marqueur utilisateur:', error);
      }
    }

    try {
      // Créer l'élément DOM pour le marqueur utilisateur
      const userElement = document.createElement('div');
      userElement.className = 'user-location-marker';
      userElement.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      `;
      
      userElement.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: #3B82F6;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          font-size: 11px;
          font-weight: bold;
          background: #3B82F6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-top: 4px;
          white-space: nowrap;
        ">
          Ma position
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      `;

      // Créer la popup pour le marqueur utilisateur
      const userPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 12px; min-width: 160px;">
          <h3 style="font-weight: bold; font-size: 14px; color: #3B82F6; margin-bottom: 8px;">
            📍 Votre position
          </h3>
          <p style="font-size: 12px; color: #6B7280; margin: 0;">
            Localisation actuelle détectée
          </p>
          <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
            Lat: ${userLocation[1].toFixed(6)}<br>
            Lng: ${userLocation[0].toFixed(6)}
          </div>
        </div>
      `);

      userMarkerRef.current = new mapboxgl.Marker({
        element: userElement,
        anchor: 'bottom'
      })
        .setLngLat(userLocation)
        .setPopup(userPopup)
        .addTo(map);

      console.log('📍 Marqueur utilisateur ajouté avec succès:', userLocation);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du marqueur utilisateur:', error);
    }
  }, [map, userLocation]);

  // Créer les marqueurs pour les résultats avec POI
  useEffect(() => {
    if (!isMapReady() || !results.length) return;

    // Nettoyer les anciens marqueurs de résultats
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Erreur lors de la suppression du marqueur:', error);
      }
    });
    markersRef.current = [];

    results.forEach((result, index) => {
      if (!result.coordinates) return;

      try {
        // Créer l'élément DOM pour le marqueur POI
        const element = document.createElement('div');
        element.className = 'poi-marker';
        element.innerHTML = `
          <div class="flex flex-col items-center cursor-pointer">
            <div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors">
              <span class="text-white font-bold text-sm">${index + 1}</span>
            </div>
            <div class="text-xs font-medium bg-white px-2 py-1 rounded shadow-md mt-1 max-w-32 truncate">
              ${result.name}
            </div>
          </div>
        `;

        // Créer la popup avec informations détaillées
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3 min-w-48">
            <h3 class="font-bold text-sm mb-2">${result.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${result.address}</p>
            <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
              <span>📍 ${result.distance?.toFixed(1)} km</span>
              <span>⏱️ ${result.duration} min</span>
            </div>
            <div class="flex gap-2">
              <button class="route-btn bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600" 
                      data-place-id="${result.id}">
                🗺️ Itinéraire
              </button>
              <button class="info-btn bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600">
                ℹ️ Infos
              </button>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({
          element,
          anchor: 'bottom'
        })
          .setLngLat(result.coordinates)
          .setPopup(popup)
          .addTo(map);

        // Gérer les clics sur les boutons de la popup
        element.addEventListener('click', () => {
          marker.togglePopup();
        });

        // Gérer le clic sur le bouton itinéraire
        popup.on('open', () => {
          const routeBtn = popup.getElement()?.querySelector('.route-btn') as HTMLButtonElement;
          if (routeBtn) {
            routeBtn.addEventListener('click', () => {
              onRouteRequest(result.id);
              drawRoute(userLocation, result.coordinates);
            });
          }
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du marqueur POI:', error);
      }
    });

    console.log('🎯 Marqueurs POI ajoutés:', results.length);
  }, [map, results, userLocation, onRouteRequest]);

  // Fonction pour dessiner la route
  const drawRoute = async (start: [number, number] | null, end: [number, number]) => {
    if (!isMapReady() || !start) return;

    try {
      const directions = await mapboxApiService.getDirections(start, end, 'walking');
      
      if (directions && directions.geometry) {
        const source = map.getSource('route-line') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: directions.geometry as GeoJSON.Geometry
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du tracé de la route:', error);
    }
  };

  // Nettoyer lors du démontage
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, []);

  return null;
};

export default UniqueMapMarkers;
