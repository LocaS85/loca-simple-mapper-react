
import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchCoordination } from '@/hooks/useGeoSearchCoordination';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { usePOIIntegration } from '@/hooks/usePOIIntegration';
import UniqueMapMarkers from './map/UniqueMapMarkers';
import { MapCluster, EnhancedMapboxDirections } from '@/components/map';
import { MapPin, Wifi, WifiOff } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
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
  } = useGeoSearchCoordination();

  const { pointsOfInterest, bounds } = usePOIIntegration();

  // Track render performance
  useEffect(() => {
    trackRender('MapView');
  });

  // Initialize map with enhanced error handling
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady || !statusInfo.isReady) return;
    
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
      newMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('✅ Carte chargée avec succès');
        setMapLoaded(true);
        setMapError(null);
      });

      newMap.on('zoom', () => {
        setZoom(newMap.getZoom());
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Erreur de carte:', e);
        setMapError('Erreur de chargement de la carte');
      });
      
      map.current = newMap;
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        setMapLoaded(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, userLocation, isMapboxReady, statusInfo.isReady]);

  // Optimized bounds fitting
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
        ? { top: 120, bottom: 100, left: 20, right: 20 }
        : { top: 100, bottom: 80, left: 80, right: 80 };
      
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
    if (statusInfo.hasResults) {
      fitBounds();
    }
  }, [results, mapLoaded, userLocation, isMobile, statusInfo.hasResults]);

  // Enhanced error display
  if (!statusInfo.isReady || mapError) {
    return (
      <div className="w-full h-full pt-12 pb-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {networkStatus === 'offline' ? (
              <WifiOff className="h-8 w-8 text-red-600" />
            ) : (
              <MapPin className="h-8 w-8 text-red-600" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            {networkStatus === 'offline' ? 'Problème de connexion' : 'Problème de configuration'}
          </h3>
          <p className="text-gray-600 mb-6">
            {mapError || 'Token Mapbox requis pour afficher la carte'}
          </p>
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
            {/* Marqueurs uniques */}
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

            {/* Clustering POI */}
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

            {/* Directions intégrées */}
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
