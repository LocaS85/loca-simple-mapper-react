
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
import { usePOIIntegration } from '@/hooks/usePOIIntegration';
import UniqueMapMarkers from './map/UniqueMapMarkers';
import MapStatusIndicator from './map/MapStatusIndicator';
import { MapCluster, EnhancedMapboxDirections } from '@/components/map';
import { MapPin, Wifi, WifiOff } from 'lucide-react';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(12);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
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

  const { pointsOfInterest, bounds } = usePOIIntegration();

  // Track render performance
  useEffect(() => {
    trackRender('MapView');
  });

  // Initialize map with enhanced error handling
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      if (!isMapboxTokenValid()) {
        setMapError('Invalid Mapbox token - use a public token (pk.)');
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
      
      // Add fullscreen control
      newMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('✅ Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });

      newMap.on('zoom', () => {
        setZoom(newMap.getZoom());
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Map error:', e);
        setMapError('Map loading error');
      });

      // Add click handler for coordinates
      newMap.on('click', (e) => {
        console.log('Map clicked at:', e.lngLat);
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
      console.error('❌ Map initialization error:', error);
      setMapError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [isMobile, userLocation, isMapboxReady, toast, t, setUserLocation, loadResults]);

  // Optimized bounds fitting with enhanced logic
  const fitBounds = throttle(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const mapBounds = new mapboxgl.LngLatBounds();
      mapBounds.extend(userLocation);
      
      if (results.length > 0) {
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
      } else {
        map.current.easeTo({
          center: userLocation,
          zoom: isMobile ? 13 : 15,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
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
      
      if (directions.geometry) {
        const distance = Math.round(directions.distance / 1000 * 10) / 10;
        const duration = Math.round(directions.duration / 60);
        
        toast({
          title: "Route calculated",
          description: `${distance} km • ${duration} min`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('❌ Route calculation error:', error);
      toast({
        title: "Route error",
        description: "Unable to calculate route",
        variant: "destructive",
      });
    }
  }, 300);

  const handleMarkerClick = (poi: any) => {
    setSelectedPOI(poi);
    setShowPopup(true);
  };

  const handleDirectionsClick = (coordinates: [number, number]) => {
    const poi = pointsOfInterest.find(p => 
      p.coordinates[0] === coordinates[0] && p.coordinates[1] === coordinates[1]
    );
    if (poi) {
      handleRouteRequest(poi.id);
    }
  };

  const handleClusterClick = (longitude: number, latitude: number, expansionZoom: number) => {
    if (map.current) {
      map.current.easeTo({
        center: [longitude, latitude],
        zoom: expansionZoom,
        duration: 500
      });
    }
  };

  // Enhanced error display with network status
  if (mapboxError || !isMapboxReady || mapError) {
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
            {networkStatus === 'offline' ? 'Connection Problem' : 'Configuration Problem'}
          </h3>
          <p className="text-gray-600 mb-6">
            {mapError || mapboxError || 'Mapbox token required to display the map'}
          </p>
          
          {/* Network status indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {networkStatus === 'offline' ? (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            ) : networkStatus === 'slow' ? (
              <>
                <Wifi className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Slow connection</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Online</span>
              </>
            )}
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retry
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
                {!mapLoaded ? 'Loading map...' : 'Searching...'}
              </p>
              {networkStatus === 'slow' && (
                <p className="text-xs text-orange-600 mt-2 flex items-center justify-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Slow connection detected...
                </p>
              )}
            </div>
          </div>
        )}
        
        {mapLoaded && map.current && (
          <>
            {/* Unique markers (user + POI) */}
            <UniqueMapMarkers
              map={map.current}
              userLocation={userLocation}
              results={results}
              onRouteRequest={handleRouteRequest}
            />

            {/* POI clustering */}
            {pointsOfInterest.length > 0 && (
              <MapCluster
                pointsOfInterest={pointsOfInterest}
                bounds={bounds}
                zoom={zoom}
                showPopup={showPopup}
                selectedPOI={selectedPOI}
                onMarkerClick={handleMarkerClick}
                onDirectionsClick={handleDirectionsClick}
                onClusterClick={handleClusterClick}
                onPopupClose={() => setShowPopup(false)}
              />
            )}

            {/* Integrated directions */}
            {userLocation && (
              <EnhancedMapboxDirections
                map={map.current}
                transportMode={transport}
                origin={userLocation}
                showInstructions={false}
              />
            )}
            
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
