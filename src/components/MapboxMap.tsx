
import React, { useRef, useState, useEffect } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl';
import { LocateFixed, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getMapboxToken, isMapboxTokenValid, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import MapboxSetup from '@/components/MapboxSetup';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchResult } from '@/types/geosearch';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface MapboxMapProps {
  results?: SearchResult[];
  transport?: string;
  radius?: number;
  count?: number;
  category?: string;
  className?: string;
}

export default function MapboxMap({ 
  results = [], 
  transport = "walking", 
  radius = 10,
  category = "",
  className = ""
}: MapboxMapProps) {
  const [viewport, setViewport] = useState({
    longitude: DEFAULT_MAP_CENTER[0],
    latitude: DEFAULT_MAP_CENTER[1],
    zoom: DEFAULT_MAP_ZOOM,
  });

  const mapRef = useRef<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mapError, setMapError] = useState<string | null>(null);
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Use GeoSearch store for better integration
  const { userLocation, setUserLocation } = useGeoSearchStore();

  // Check Mapbox token on mount
  useEffect(() => {
    try {
      const token = getMapboxToken();
      if (!isMapboxTokenValid()) {
        setShowTokenSetup(true);
        return;
      }
    } catch (error) {
      console.error('Mapbox configuration error:', error);
      setShowTokenSetup(true);
      return;
    }
  }, []);

  // Get user position with improved error handling
  useEffect(() => {
    if (showTokenSetup || userLocation) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setViewport({ 
            ...viewport, 
            latitude: coordinates[1], 
            longitude: coordinates[0] 
          });
          setUserLocation(coordinates);
        },
        (err) => {
          console.error('Geolocation error:', err);
          toast({
            title: "Localisation",
            description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
            variant: "destructive",
          });
        },
        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, [toast, showTokenSetup, userLocation, setUserLocation]);

  // Helper to get color based on category
  const getColorForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'restaurant':
      case 'food':
        return '#e67e22';
      case 'health':
      case 'santé':
        return '#27ae60';
      case 'entertainment':
      case 'divertissement':
        return '#8e44ad';
      case 'shopping':
        return '#f39c12';
      default:
        return '#3498db';
    }
  };

  // Show token setup interface
  if (showTokenSetup) {
    return <MapboxSetup />;
  }

  // Check token validity before rendering map
  if (!isMapboxTokenValid()) {
    return <MapboxError onRetry={() => window.location.reload()} />;
  }

  const mapboxToken = getMapboxToken();

  return (
    <div 
      className={`relative w-full h-full min-h-[300px] rounded-xl shadow-lg overflow-hidden border border-gray-200 ${className}`}
      role="application"
      aria-label={`Carte interactive affichant ${results.length} résultat${results.length > 1 ? 's' : ''} pour ${category || 'votre recherche'}`}
    >
      {/* Status live region for screen readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="map-status"
      >
        {isMapLoaded ? 
          `Carte chargée. ${results.length} résultat${results.length > 1 ? 's' : ''} affiché${results.length > 1 ? 's' : ''}.` :
          'Chargement de la carte...'
        }
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          ...viewport,
          zoom: isMobile ? viewport.zoom - 1 : viewport.zoom
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => setViewport(evt.viewState)}
        onLoad={() => {
          setIsMapLoaded(true);
          console.log('🗺️ Carte Mapbox chargée');
        }}
        onError={(e) => {
          console.error("Mapbox error:", e);
          setMapError(e.error?.message || "Error loading map");
        }}
        aria-label="Carte interactive Mapbox"
        role="img"
        tabIndex={0}
        keyboard={true}
      >
        <NavigationControl 
          position="top-left"
          showCompass={true}
          showZoom={true}
          visualizePitch={true}
        />
        
        <GeolocateControl
          position="top-left"
          trackUserLocation
          showAccuracyCircle={false}
          showUserHeading={true}
          positionOptions={{
            enableHighAccuracy: true,
            timeout: 6000
          }}
        />

        {userLocation && (
          <Marker 
            longitude={userLocation[0]} 
            latitude={userLocation[1]} 
            anchor="bottom"
            aria-label="Votre position actuelle"
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center p-1 animate-pulse"
                role="img"
                aria-label="Marqueur de votre position"
              >
                <MapPin className="text-white w-4 h-4" />
              </div>
              <div className="text-xs font-bold bg-white px-1 rounded shadow-sm mt-1">
                Vous
              </div>
            </div>
          </Marker>
        )}

        {results.map((result, index) => (
          result.coordinates && (
            <Marker 
              key={result.id || index}
              longitude={result.coordinates[0]} 
              latitude={result.coordinates[1]} 
              anchor="bottom"
              aria-label={`${result.name} - ${result.address}`}
            >
              <div className="flex flex-col items-center">
                <MapPin 
                  className="w-6 h-6 drop-shadow-md" 
                  style={{ color: getColorForCategory(result.category || category) }} 
                  role="img"
                  aria-label={`Marqueur pour ${result.name}`}
                />
                <div 
                  className="text-xs bg-white px-1 rounded shadow-sm max-w-20 truncate"
                  title={result.name}
                >
                  {result.name}
                </div>
              </div>
            </Marker>
          )
        ))}
      </Map>

      {mapError && (
        <div 
          className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center p-4">
            <p className="text-red-600 font-semibold" id="map-error-message">
              {mapError}
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => window.location.reload()}
              aria-describedby="map-error-message"
            >
              Recharger la carte
            </button>
          </div>
        </div>
      )}

      {userLocation && (
        <button
          className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({ 
                center: [userLocation[0], userLocation[1]], 
                zoom: 14,
                duration: 1000 
              });
            }
          }}
          aria-label="Centrer la carte sur ma position"
          title="Centrer sur ma position"
          type="button"
        >
          <LocateFixed className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
