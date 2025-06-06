
import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const {
    userLocation,
    results,
    isLoading,
    networkStatus
  } = useGeoSearchStore();

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || isInitialized) return;

    const initializeMap = async () => {
      try {
        if (!isMapboxTokenValid()) {
          setMapError('Token Mapbox non configuré');
          return;
        }

        const token = getMapboxToken();
        mapboxgl.accessToken = token;

        console.log('🗺️ Initialisation unique de la carte...');
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: userLocation || [2.3522, 48.8566],
          zoom: isMobile ? 10 : 12,
          attributionControl: false,
          logoPosition: 'bottom-right'
        });

        // Add controls
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true
        });
        newMap.addControl(geolocateControl, 'top-right');

        newMap.on('load', () => {
          console.log('✅ Carte chargée et stabilisée');
          setIsMapLoaded(true);
          setMapInstance(newMap);
          setMapError(null);
        });

        newMap.on('error', (e) => {
          console.error('❌ Erreur carte:', e);
          setMapError('Impossible de charger la carte');
        });

        map.current = newMap;
        setIsInitialized(true);

      } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        setMapError('Erreur de configuration');
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapInstance(null);
        setIsMapLoaded(false);
        setIsInitialized(false);
      }
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (mapInstance && userLocation) {
      mapInstance.flyTo({
        center: userLocation,
        zoom: isMobile ? 14 : 16,
        duration: 1000
      });
    }
  }, [mapInstance, userLocation, isMobile]);

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-4 text-center">
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
    <div className="absolute inset-0">
      <div ref={mapContainer} className="w-full h-full" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Chargement de la carte...
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {networkStatus === 'offline' ? (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600">Hors ligne</span>
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
      )}
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
