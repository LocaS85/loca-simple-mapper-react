import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { mapboxApiService } from '@/services/mapboxApiService';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = ({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Utiliser le store avec API connectée
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    mapboxError
  } = useGeoSearchStore();

  console.log('🗺️ MapView rendering - results:', results.length, 'userLocation:', userLocation, 'mapboxReady:', isMapboxReady);

  // Initialiser la carte seulement si l'API est prête et le token valide
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      // Vérifier la validité du token avant d'initialiser
      if (!isMapboxTokenValid()) {
        setMapError('Token Mapbox invalide - utilisez un token public (pk.)');
        return;
      }

      const mapboxToken = getMapboxToken();
      mapboxgl.accessToken = mapboxToken;
      
      console.log('🗺️ Initialisation de la carte avec token public');
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [2.35, 48.85],
        zoom: isMobile ? 10 : 12
      });
      
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('✅ Carte chargée avec succès');
        setMapLoaded(true);
        setMapError(null);
        
        // Ajouter une source pour les itinéraires
        newMap.addSource('route', {
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
        
        // Ajouter un layer pour afficher les itinéraires
        newMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Erreur de carte:', e);
        setMapError('Erreur de chargement de la carte');
        toast({
          title: t("map.error"),
          description: t("map.errorLoading"),
          variant: "destructive",
        });
      });
      
      map.current = newMap;
      
      return () => {
        map.current?.remove();
        map.current = null;
        setMapLoaded(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, toast, userLocation, t, isMapboxReady]);

  // Ajuster la carte aux résultats
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Ajouter la localisation utilisateur aux limites
      bounds.extend(userLocation);
      
      // Ajouter tous les résultats aux limites s'il y en a
      if (results.length > 0) {
        console.log('🎯 Extending bounds with results:', results.length);
        results.forEach(place => {
          bounds.extend(place.coordinates);
        });
        
        map.current.fitBounds(bounds, {
          padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
          maxZoom: isMobile ? 13 : 15
        });
      } else {
        // Si pas de résultats, centrer sur la position utilisateur
        console.log('📍 No results, centering on user location');
        map.current.setCenter(userLocation);
        map.current.setZoom(isMobile ? 10 : 12);
      }
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
    }
  }, [results, mapLoaded, userLocation, isMobile]);

  // Mettre à jour les marqueurs et itinéraires quand les résultats changent
  useEffect(() => {
    if (!map.current || !mapLoaded || !isMapboxReady) return;
    
    console.log('🔄 Updating markers with results:', results.length);
    
    // Effacer les marqueurs existants
    const markerElements = document.querySelectorAll('.mapboxgl-marker');
    markerElements.forEach(marker => {
      marker.remove();
    });
    
    // Ajouter le marqueur de position utilisateur
    if (userLocation) {
      console.log('📍 Adding user location marker');
      new mapboxgl.Marker({ color: '#3b82f6', scale: 1.2 })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-sm">${t('geosearch.yourPosition')}</h3>
            <p class="text-xs text-gray-500 mt-1">Votre localisation actuelle</p>
          </div>
        `))
        .addTo(map.current);
    }
    
    // Ajouter les marqueurs de résultats avec itinéraires
    results.forEach((place, index) => {
      console.log(`📍 Adding marker ${index + 1} for place:`, place.name);
      
      const marker = new mapboxgl.Marker({ color: '#ef4444', scale: 1.0 })
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
        .addTo(map.current);
      
      // Ajouter la fonction globale pour afficher l'itinéraire
      (window as any).showRouteToPlace = async (placeId: string) => {
        const targetPlace = results.find(p => p.id === placeId);
        if (!targetPlace || !userLocation || !map.current) return;
        
        try {
          console.log('🛣️ Calculating route to:', targetPlace.name);
          
          const directions = await mapboxApiService.getDirections(
            userLocation,
            targetPlace.coordinates,
            transport || 'walking'
          );
          
          // Mettre à jour la source de l'itinéraire
          const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {
                name: `Route vers ${targetPlace.name}`,
                distance: directions.distance,
                duration: directions.duration
              },
              geometry: directions.geometry
            });
            
            toast({
              title: "Itinéraire calculé",
              description: `Distance: ${Math.round(directions.distance / 1000 * 10) / 10} km, Durée: ${Math.round(directions.duration / 60)} min`,
              variant: "default",
            });
          }
          
        } catch (error) {
          console.error('❌ Error calculating route:', error);
          toast({
            title: "Erreur d'itinéraire",
            description: "Impossible de calculer l'itinéraire",
            variant: "destructive",
          });
        }
      };
    });
    
  }, [results, mapLoaded, userLocation, t, transport, toast, isMapboxReady]);

  // Afficher un message d'erreur si problème de token ou d'API
  if (mapboxError || !isMapboxReady || mapError) {
    return (
      <div className="w-full h-full pt-24 pb-16 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Problème de configuration Mapbox
          </h3>
          <p className="text-gray-600 mb-4">
            {mapError || mapboxError || 'Token Mapbox requis'}
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Utilisez un token PUBLIC (pk.) pour le frontend</p>
            <p>• Configurez VITE_MAPBOX_ACCESS_TOKEN</p>
            <p>• Obtenez votre token sur mapbox.com</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pt-24 pb-16">
      <div ref={mapContainer} className="relative w-full h-full">
        {/* Indicateur de chargement */}
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-2 text-sm text-gray-600">
                {!mapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Indicateur du nombre de résultats */}
        {mapLoaded && results.length > 0 && !isLoading && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-10">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-medium">{results.length} résultat{results.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
        
        {/* Légende des marqueurs */}
        {mapLoaded && userLocation && (
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Légende</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Votre position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Résultats trouvés</span>
              </div>
              {routeSource && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-blue-500"></div>
                  <span>Itinéraire</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
