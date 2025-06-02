
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
import MapLegend from './map/MapLegend';
import MapStatusIndicator from './map/MapStatusIndicator';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
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
    networkStatus
  } = useGeoSearchStore();

  // Track render performance
  useEffect(() => {
    trackRender('MapView');
  });

  // Initialize map with error handling
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      if (!isMapboxTokenValid()) {
        setMapError('Token Mapbox invalide');
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
      
      // Add controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocation control with enhanced options
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true
      });
      
      newMap.addControl(geolocateControl, 'top-right');
      
      // Listen for geolocation events
      geolocateControl.on('geolocate', (e) => {
        const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
        console.log('📍 Géolocalisation mise à jour:', coords);
        
        // Update store with new location
        const { setUserLocation } = useGeoSearchStore.getState();
        setUserLocation(coords);
        
        toast({
          title: "Position mise à jour",
          description: "Votre localisation a été détectée avec succès",
          variant: "default",
        });
      });
      
      geolocateControl.on('error', (e) => {
        console.error('❌ Erreur de géolocalisation:', e);
        toast({
          title: "Erreur de localisation",
          description: "Impossible d'obtenir votre position",
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
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 8],
            'line-opacity': 0.8
          }
        });
        
        setHasRouteLayer(true);
        
        // Auto-trigger geolocation if no user location
        if (!userLocation) {
          setTimeout(() => {
            geolocateControl.trigger();
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
        setMapLoaded(false);
        setHasRouteLayer(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, userLocation, isMapboxReady, toast, t]);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create user location marker
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-location-marker';
    userMarkerElement.innerHTML = `
      <div class="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
    `;

    userMarker.current = new mapboxgl.Marker(userMarkerElement)
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-sm text-blue-600">${t('geosearch.yourPosition')}</h3>
          <p class="text-xs text-gray-500 mt-1">Votre localisation actuelle</p>
        </div>
      `))
      .addTo(map.current);

    console.log('📍 Marqueur utilisateur mis à jour:', userLocation);
  }, [userLocation, mapLoaded, t]);

  // Optimized bounds fitting with throttling
  const fitBounds = throttle(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(userLocation);
      
      if (results.length > 0) {
        results.forEach(place => {
          bounds.extend(place.coordinates);
        });
        
        map.current.fitBounds(bounds, {
          padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
          maxZoom: isMobile ? 13 : 15,
          duration: 1000
        });
      } else {
        map.current.easeTo({
          center: userLocation,
          zoom: isMobile ? 12 : 14,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
    }
  }, 500);

  useEffect(() => {
    fitBounds();
  }, [results, mapLoaded, userLocation, isMobile]);

  // Optimized route calculation with debouncing
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
  }, 300);

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
          {networkStatus === 'offline' && (
            <p className="text-sm text-orange-600 mb-4">
              📶 Connexion réseau indisponible
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-2 text-sm text-gray-600">
                {!mapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
              </p>
              {networkStatus === 'slow' && (
                <p className="text-xs text-orange-600 mt-1">
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
            />
            
            {userLocation && (
              <MapLegend hasRouteLayer={hasRouteLayer} />
            )}
          </>
        )}
      </div>
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
