
import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchManager } from '@/hooks/useGeoSearchManager';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { usePOIIntegration } from '@/hooks/usePOIIntegration';
import UniqueMapMarkers from './map/UniqueMapMarkers';
import { MapCluster, EnhancedMapboxDirections } from '@/components/map';
import { MapPin, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [zoom, setZoom] = useState(12);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { trackRender, throttle } = usePerformanceOptimization();
  
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo
  } = useGeoSearchManager();

  const { pointsOfInterest, bounds } = usePOIIntegration();

  // Track render performance
  useEffect(() => {
    trackRender('MapView');
  });

  // Initialize map with enhanced error handling and loading states
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const initializeMap = async () => {
      setIsInitializing(true);
      setMapError(null);
      
      try {
        // Wait for Mapbox to be ready
        if (!isMapboxReady) {
          console.log('⏳ En attente de l\'initialisation Mapbox...');
          return;
        }

        if (!isMapboxTokenValid()) {
          throw new Error('Token Mapbox invalide');
        }

        const mapboxToken = getMapboxToken();
        mapboxgl.accessToken = mapboxToken;
        
        // Create map with responsive settings
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: userLocation || [2.35, 48.85],
          zoom: isMobile ? 10 : 12,
          attributionControl: false,
          logoPosition: 'bottom-right'
        });
        
        // Add responsive controls
        const nav = new mapboxgl.NavigationControl({
          showCompass: !isMobile,
          showZoom: true,
          visualizePitch: !isMobile
        });
        newMap.addControl(nav, 'top-right');
        
        if (!isMobile) {
          newMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        }
        
        // Add geolocation control
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        });
        newMap.addControl(geolocate, 'top-right');
        
        newMap.on('load', () => {
          console.log('✅ Carte chargée avec succès');
          setMapLoaded(true);
          setMapError(null);
          setIsInitializing(false);
        });

        newMap.on('zoom', () => {
          setZoom(newMap.getZoom());
        });
        
        newMap.on('error', (e) => {
          console.error('❌ Erreur de carte:', e);
          setMapError('Erreur de chargement de la carte');
          setIsInitializing(false);
        });
        
        // Handle network issues
        newMap.on('sourcedata', (e) => {
          if (e.isSourceLoaded && e.source.type === 'vector') {
            console.log('📡 Données de carte chargées');
          }
        });
        
        map.current = newMap;
        
        return () => {
          if (map.current) {
            map.current.remove();
            map.current = null;
          }
          setMapLoaded(false);
          setIsInitializing(false);
        };
      } catch (error) {
        console.error('❌ Erreur d\'initialisation de la carte:', error);
        setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsInitializing(false);
      }
    };

    initializeMap();
  }, [isMobile, userLocation, isMapboxReady]);

  // Optimized bounds fitting with responsive padding
  const fitBounds = throttle(() => {
    if (!map.current || !mapLoaded || !userLocation || !statusInfo.hasResults) return;
    
    try {
      const mapBounds = new mapboxgl.LngLatBounds();
      mapBounds.extend(userLocation);
      
      results.forEach(place => {
        if (place.coordinates) {
          mapBounds.extend(place.coordinates);
        }
      });
      
      const padding = isMobile 
        ? { top: 100, bottom: 120, left: 20, right: 20 }
        : { top: 80, bottom: 60, left: 60, right: 60 };
      
      map.current.fitBounds(mapBounds, {
        padding,
        maxZoom: isMobile ? 14 : 16,
        duration: 1200
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajustement des limites:', error);
    }
  }, 300);

  useEffect(() => {
    if (statusInfo.hasResults && mapLoaded) {
      fitBounds();
    }
  }, [results, mapLoaded, userLocation, isMobile, statusInfo.hasResults]);

  // Enhanced loading and error states
  if (isInitializing || !isMapboxReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-sm mx-4 text-center">
          <LoadingSpinner />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 mt-4">
            Initialisation de la carte
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Configuration des services de géolocalisation...
          </p>
          <div className="flex items-center justify-center gap-2">
            {networkStatus === 'offline' ? (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600">Hors ligne</span>
              </>
            ) : networkStatus === 'slow' ? (
              <>
                <Wifi className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-orange-600">Connexion lente</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">En ligne</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Problème de carte
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            {mapError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
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
            <div className="text-center bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <LoadingSpinner />
              <p className="mt-3 text-sm text-gray-600 font-medium">
                {!mapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
              </p>
              {networkStatus === 'slow' && (
                <p className="text-xs text-orange-600 mt-2 flex items-center justify-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Connexion lente détectée...
                </p>
              )}
            </div>
          </div>
        )}
        
        {mapLoaded && map.current && (
          <>
            {/* User location and search results markers */}
            <UniqueMapMarkers
              map={map.current}
              userLocation={userLocation}
              results={results}
              onRouteRequest={(placeId) => {
                const place = results.find(p => p.id === placeId);
                if (place) {
                  toast({
                    title: "Itinéraire",
                    description: `Calcul vers ${place.name}`,
                    variant: "default",
                  });
                }
              }}
            />

            {/* POI clustering */}
            {pointsOfInterest.length > 0 && (
              <MapCluster
                pointsOfInterest={pointsOfInterest}
                bounds={bounds}
                zoom={zoom}
                showPopup={false}
                selectedPOI={null}
                onMarkerClick={() => {}}
                onDirectionsClick={() => {}}
                onClusterClick={(lng, lat, expansionZoom) => {
                  if (map.current) {
                    map.current.easeTo({
                      center: [lng, lat],
                      zoom: expansionZoom,
                      duration: 500
                    });
                  }
                }}
                onPopupClose={() => {}}
              />
            )}

            {/* Enhanced directions */}
            {userLocation && (
              <EnhancedMapboxDirections
                map={map.current}
                transportMode={transport}
                origin={userLocation}
                showInstructions={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
