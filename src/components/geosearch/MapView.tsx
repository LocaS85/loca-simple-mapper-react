
import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { mapboxApiService } from '@/services/mapboxApiService';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import MapMarkers from './map/MapMarkers';
import MapStatusIndicator from './map/MapStatusIndicator';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasRouteLayer, setHasRouteLayer] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { trackRender, debounce, throttle } = usePerformanceOptimization();
  
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    mapboxError,
    networkStatus,
    setUserLocation,
    loadResults
  } = useGeoSearchStore();

  // Track render performance
  useEffect(() => {
    trackRender('MapView');
  });

  // Initialize map with enhanced error handling
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      if (!isMapboxTokenValid()) {
        setMapError('Token Mapbox invalide - utilisez un token public (pk.)');
        return;
      }

      const mapboxToken = getMapboxToken();
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [2.35, 48.85],
        zoom: isMobile ? 10 : 12,
        attributionControl: false
      });
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add enhanced geolocation control with better UX
      const geolocateControlInstance = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: false
      });
      
      geolocateControl.current = geolocateControlInstance;
      newMap.addControl(geolocateControlInstance, 'top-right');
      
      // Enhanced geolocation event handling
      geolocateControlInstance.on('geolocate', async (e) => {
        const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
        console.log('📍 Géolocalisation détectée:', coords);
        
        setUserLocation(coords);
        
        // Trigger automatic search with new location
        setTimeout(() => {
          loadResults();
        }, 500);
        
        toast({
          title: "Position détectée",
          description: "Recherche mise à jour avec votre localisation",
          variant: "default",
        });
      });
      
      geolocateControlInstance.on('error', (e) => {
        console.error('❌ Erreur de géolocalisation:', e);
        
        let errorMessage = "Impossible d'obtenir votre position";
        if (e.code === 1) {
          errorMessage = "Géolocalisation refusée. Autorisez l'accès à votre position.";
        } else if (e.code === 2) {
          errorMessage = "Position indisponible. Vérifiez votre connexion.";
        } else if (e.code === 3) {
          errorMessage = "Délai d'attente dépassé pour la géolocalisation.";
        }
        
        toast({
          title: "Erreur de localisation",
          description: errorMessage,
          variant: "destructive",
        });
      });
      
      newMap.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        
        // Add optimized route layer
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
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 8],
            'line-opacity': 0.8
          }
        });
        
        setHasRouteLayer(true);
        
        // Auto-trigger geolocation if no user location
        if (!userLocation) {
          setTimeout(() => {
            geolocateControlInstance.trigger();
          }, 1000);
        }
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Erreur de carte:', e);
        setMapError('Erreur de chargement de la carte');
      });
      
      map.current = newMap;
      
      return () => {
        if (userMarker.current) {
          userMarker.current.remove();
        }
        map.current?.remove();
        map.current = null;
        geolocateControl.current = null;
        setMapLoaded(false);
        setHasRouteLayer(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, userLocation, isMapboxReady, toast, t, setUserLocation, loadResults]);

  // Enhanced user location marker with better visibility
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create enhanced user location marker
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-location-marker';
    userMarkerElement.innerHTML = `
      <div class="relative">
        <div class="w-8 h-8 bg-blue-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center animate-pulse">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div class="absolute w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-ping -top-2 -left-2"></div>
      </div>
    `;

    userMarker.current = new mapboxgl.Marker(userMarkerElement)
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
            <p class="text-xs text-gray-500">Votre localisation actuelle</p>
          </div>
        </div>
      `))
      .addTo(map.current);

    console.log('📍 Marqueur utilisateur créé:', userLocation);
  }, [userLocation, mapLoaded, t]);

  // Optimized bounds fitting with enhanced logic
  const fitBounds = throttle(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(userLocation);
      
      if (results.length > 0) {
        results.forEach(place => {
          if (place.coordinates) {
            bounds.extend(place.coordinates);
          }
        });
        
        const padding = isMobile 
          ? { top: 100, bottom: 80, left: 20, right: 20 }
          : { top: 80, bottom: 60, left: 60, right: 60 };
        
        map.current.fitBounds(bounds, {
          padding,
          maxZoom: isMobile ? 14 : 16,
          duration: 1200
        });
      } else {
        map.current.easeTo({
          center: userLocation,
          zoom: isMobile ? 13 : 15,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajustement des limites:', error);
    }
  }, 300);

  useEffect(() => {
    fitBounds();
  }, [results, mapLoaded, userLocation, isMobile]);

  // Enhanced route calculation with better error handling
  const handleRouteRequest = debounce(async (placeId: string) => {
    const targetPlace = results.find(p => p.id === placeId);
    if (!targetPlace || !userLocation || !map.current) return;
    
    try {
      const directions = await mapboxApiService.getDirections(
        userLocation,
        targetPlace.coordinates,
        transport || 'walking'
      );
      
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      if (source && directions.geometry) {
        source.setData({
          type: 'Feature',
          properties: {
            name: `Route vers ${targetPlace.name}`,
            distance: directions.distance,
            duration: directions.duration
          },
          geometry: directions.geometry as GeoJSON.Geometry
        });
        
        const distance = Math.round(directions.distance / 1000 * 10) / 10;
        const duration = Math.round(directions.duration / 60);
        
        toast({
          title: "Itinéraire calculé",
          description: `${distance} km • ${duration} min`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('❌ Erreur de calcul d\'itinéraire:', error);
      toast({
        title: "Erreur d'itinéraire",
        description: "Impossible de calculer l'itinéraire",
        variant: "destructive",
      });
    }
  }, 300);

  // Enhanced error display
  if (mapboxError || !isMapboxReady || mapError) {
    return (
      <div className="w-full h-full pt-12 pb-16 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Problème de configuration
          </h3>
          <p className="text-gray-600 mb-6">
            {mapError || mapboxError || 'Token Mapbox requis pour afficher la carte'}
          </p>
          {networkStatus === 'offline' && (
            <p className="text-sm text-orange-600 mb-4 flex items-center justify-center gap-2">
              <span>📶</span> Connexion réseau indisponible
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full">
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <LoadingSpinner />
              <p className="mt-3 text-sm text-gray-600 font-medium">
                {!mapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
              </p>
              {networkStatus === 'slow' && (
                <p className="text-xs text-orange-600 mt-2">
                  Connexion lente détectée...
                </p>
              )}
            </div>
          </div>
        )}
        
        {mapLoaded && map.current && (
          <>
            <MapMarkers
              map={map.current}
              userLocation={userLocation}
              results={results}
              onRouteRequest={handleRouteRequest}
            />
            
            <MapStatusIndicator 
              resultsCount={results.length} 
              isLoading={isLoading}
              error={mapError}
              networkStatus={networkStatus}
            />
          </>
        )}
      </div>
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
