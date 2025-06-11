import React, { useEffect, useRef, useCallback } from 'react';
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
  const clearMarkers = useCallback(() => {
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
  }, []);

  // Vérifier si la carte est prête
  const isMapReady = useCallback(() => {
    return map && map.isStyleLoaded && map.isStyleLoaded() && map.getContainer();
  }, [map]);

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
  }, [map, isMapReady]);

  // Créer le marqueur utilisateur avec géolocalisation visible
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
      // Créer un marqueur de géolocalisation plus visible avec pulsation
      const userElement = document.createElement('div');
      userElement.className = 'user-geolocation-marker';
      userElement.innerHTML = `
        <div style="
          position: relative;
          width: 20px;
          height: 20px;
        ">
          <!-- Cercle de pulsation -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
          <!-- Marqueur principal -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 1;
          ">
            <!-- Point central -->
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 4px;
              height: 4px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        </div>
        <style>
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        </style>
      `;

      // Créer la popup pour Ma position
      const userPopup = new mapboxgl.Popup({
        offset: 20,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 10px; text-align: center;">
          <div style="
            width: 32px;
            height: 32px;
            background: #3B82F6;
            border-radius: 50%;
            margin: 0 auto 8px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
          ">
            📍
          </div>
          <strong style="color: #1f2937;">Ma position</strong>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            Position actuelle détectée
          </div>
        </div>
      `);

      userMarkerRef.current = new mapboxgl.Marker({
        element: userElement,
        anchor: 'center'
      })
        .setLngLat(userLocation)
        .setPopup(userPopup)
        .addTo(map);

      console.log('📍 Marqueur de géolocalisation ajouté avec succès:', userLocation);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du marqueur de géolocalisation:', error);
    }
  }, [map, userLocation, isMapReady]);

  // Créer les marqueurs pour les POI
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
        element.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        `;
        
        element.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: #EF4444;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-weight: bold;
            color: white;
            font-size: 12px;
          ">
            ${index + 1}
          </div>
          <div style="
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            margin-top: 2px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            max-width: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          ">
            ${result.name}
          </div>
        `;

        // Créer la popup pour le POI
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${result.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${result.address}</p>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-bottom: 12px;">
              <span>📍 ${result.distance?.toFixed(1)} km</span>
              <span>⏱️ ${result.duration} min</span>
            </div>
            <button 
              id="route-btn-${result.id}"
              style="
                background: #3B82F6;
                color: white;
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                width: 100%;
              "
            >
              🗺️ Voir l'itinéraire
            </button>
          </div>
        `);

        const marker = new mapboxgl.Marker({
          element,
          anchor: 'bottom'
        })
          .setLngLat(result.coordinates)
          .setPopup(popup)
          .addTo(map);

        // Gérer le clic sur le bouton itinéraire
        popup.on('open', () => {
          const routeBtn = document.getElementById(`route-btn-${result.id}`);
          if (routeBtn) {
            routeBtn.addEventListener('click', () => {
              onRouteRequest(result.id);
              drawRoute(userLocation, result.coordinates);
              popup.remove();
            });
          }
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du marqueur POI:', error);
      }
    });

    console.log('🎯 Marqueurs POI ajoutés:', results.length);
  }, [map, results, userLocation, onRouteRequest, isMapReady]);

  // Fonction pour dessiner la route
  const drawRoute = useCallback(async (start: [number, number] | null, end: [number, number]) => {
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
  }, [map, isMapReady]);

  // Nettoyer lors du démontage
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return null;
};

export default UniqueMapMarkers;
