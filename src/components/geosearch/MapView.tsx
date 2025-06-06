
import React, { useRef, useEffect, useState, memo } from 'react';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import { MapInitializer } from './map/MapInitializer';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = memo(({ transport }) => {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo
  } = useGeoSearchManager();

  const handleMapLoad = (map: mapboxgl.Map) => {
    console.log('✅ Carte chargée avec succès');
    setMapInstance(map);
    setMapError(null);
  };

  const handleMapError = (error: string) => {
    console.error('❌ Erreur de carte:', error);
    setMapError(error);
    toast({
      title: "Erreur de carte",
      description: error,
      variant: "destructive",
    });
  };

  const handleLocationUpdate = (coords: [number, number]) => {
    console.log('📍 Position mise à jour:', coords);
  };

  // Enhanced loading state
  if (!isMapboxReady || !isMapboxTokenValid()) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-sm mx-4 text-center">
          <LoadingSpinner />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 mt-4">
            Initialisation de la carte
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Configuration des services Mapbox...
          </p>
          <div className="flex items-center justify-center gap-2">
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
      <MapInitializer
        userLocation={userLocation}
        isMapboxReady={isMapboxReady}
        onMapLoad={handleMapLoad}
        onError={handleMapError}
        onLocationUpdate={handleLocationUpdate}
      />
      
      {(isLoading || !mapInstance) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
          <div className="text-center bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="mt-3 text-sm text-gray-600 font-medium">
              {!mapInstance ? 'Chargement de la carte...' : 'Recherche en cours...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
