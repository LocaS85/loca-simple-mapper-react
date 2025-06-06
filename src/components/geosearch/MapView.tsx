import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import UniqueMapMarkers from './map/UniqueMapMarkers';
import FiltersFloatingButton from './FiltersFloatingButton';
import EnhancedLocationButton from './EnhancedLocationButton';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    initializeMapbox,
    filters,
    updateFilters,
    resetFilters
  } = useGeoSearchStore();

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;

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
      }
    };
  }, [isMobile, isMapboxReady, userLocation]);

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          useGeoSearchStore.getState().setUserLocation(coords);
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error);
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    }
  };

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
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Contrôles de navigation Mapbox par défaut en haut à droite */}
      
      {/* Boutons supplémentaires sous les contrôles de zoom */}
      <div className="absolute top-16 right-2 sm:right-4 z-40 flex flex-col gap-2">
        <FiltersFloatingButton
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          isLoading={isLoading}
        />
        <EnhancedLocationButton
          onLocationDetected={(coords) => handleMyLocationClick()}
          disabled={isLoading}
          variant="outline"
          size="icon"
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-md hover:bg-gray-50"
          isIconOnly={true}
        />
      </div>
      
      {/* Marqueurs */}
      {isMapLoaded && mapInstance && (
        <UniqueMapMarkers
          map={mapInstance}
          userLocation={userLocation}
          results={results}
          onRouteRequest={(placeId) => console.log('Route demandée pour:', placeId)}
        />
      )}
      
      {/* Loading overlay */}
      {(isLoading || !isMapLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
          <div className="text-center bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="mt-3 text-sm text-gray-600 font-medium">
              {!isMapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
