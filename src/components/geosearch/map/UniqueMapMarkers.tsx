
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

  // Créer le marqueur utilisateur simple
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
      // Créer un simple marqueur avec icône "Ma position"
      const userElement = document.createElement('div');
      userElement.className = 'user-location-marker';
      userElement.style.cssText = `
        width: 24px;
        height: 24px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      userElement.innerHTML = `
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      `;

      // Créer la popup simple
      const userPopup = new mapboxgl.Popup({
        offset: 15,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 8px;">
          <strong>Ma position</strong>
        </div>
      `);

      userMarkerRef.current = new mapboxgl.Marker({
        element: userElement,
        anchor: 'center'
      })
        .setLngLat(userLocation)
        .setPopup(userPopup)
        .addTo(map);

      console.log('📍 Marqueur utilisateur ajouté avec succès:', userLocation);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du marqueur utilisateur:', error);
    }
  }, [map, userLocation]);

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
