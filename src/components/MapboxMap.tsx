
import React, { useRef, useState, useEffect } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker, MapRef } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getMapboxToken, isMapboxTokenValid, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import MapboxSetup from '@/components/MapboxSetup';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchResult } from '@/types/geosearch';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import UserLocationButton from './mapbox-map/UserLocationButton';
import ResultMarkers from './mapbox-map/ResultMarkers';
import { useMapboxError } from './mapbox-map/useMapboxError';

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
  category = "",
  className = ""
}: MapboxMapProps) {
  const [viewport, setViewport] = useState({
    longitude: DEFAULT_MAP_CENTER[0],
    latitude: DEFAULT_MAP_CENTER[1],
    zoom: DEFAULT_MAP_ZOOM,
  });

  const mapRef = useRef<MapRef>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mapError, setMapError] = useState<string | null>(null);
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapboxError = useMapboxError(setShowTokenSetup);
  const { userLocation, setUserLocation } = useGeoSearchStore();
  
  console.log('🔥 MapboxMap RENDU avec:', { results: results.length, category, userLocation: userLocation ? 'présent' : 'null' });
  
  // Debug de la position utilisateur
  useEffect(() => {
    console.log('🔍 MapboxMap - userLocation state:', userLocation);
  }, [userLocation]);

  useEffect(() => {
    try {
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

  useEffect(() => {
    console.log('🔄 Géolocalisation auto - showTokenSetup:', showTokenSetup, 'userLocation:', userLocation);
    if (showTokenSetup || userLocation) return;

    if (navigator.geolocation) {
      console.log('📡 Début géolocalisation automatique...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          console.log('✅ Géolocalisation auto réussie:', coordinates);
          setViewport(prev => ({ 
            ...prev, 
            latitude: coordinates[1], 
            longitude: coordinates[0] 
          }));
          setUserLocation(coordinates);
        },
        (err) => {
          console.error('❌ Erreur géolocalisation auto:', err);
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

  useEffect(() => {
    if (userLocation && mapRef.current) {
      console.log('📍 Centrage de la carte sur:', userLocation);
      console.log('🗺️ Référence carte disponible:', !!mapRef.current);
      mapRef.current.getMap().flyTo({
        center: [userLocation[0], userLocation[1]],
        zoom: 14,
        duration: 1000
      });
    } else {
      console.log('📍 Pas de centrage - userLocation:', userLocation, 'mapRef:', !!mapRef.current);
    }
  }, [userLocation]);

  if (showTokenSetup) {
    return <MapboxSetup />;
  }

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
          setMapError(e.error?.message || "Error loading map");
          handleMapboxError(e.error);
        }}
        interactiveLayerIds={[]}
      >
        {/* Contrôles de navigation positionnés pour éviter les superpositions */}
        <NavigationControl 
          position={isMobile ? "bottom-right" : "top-left"}
          showCompass={true}
          showZoom={true}
          style={isMobile ? { 
            bottom: '140px', 
            right: '12px',
            zIndex: 20
          } : {
            top: '12px',
            left: '12px',
            zIndex: 20
          }}
        />
        
        <GeolocateControl
          position={isMobile ? "bottom-right" : "top-left"}
          trackUserLocation
          showAccuracyCircle={false}
          showUserHeading={true}
          style={isMobile ? { 
            bottom: '200px', 
            right: '12px',
            zIndex: 20
          } : {
            top: '80px',
            left: '12px',
            zIndex: 20
          }}
          positionOptions={{
            enableHighAccuracy: true,
            timeout: 6000
          }}
        />

        {userLocation ? (
          <Marker 
            longitude={userLocation[0]} 
            latitude={userLocation[1]} 
            anchor="center"
          >
            <div 
              className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg"
              style={{ 
                zIndex: 1000,
                position: 'relative',
                backgroundColor: 'red',
                border: '4px solid white'
              }}
            >
              <div className="w-full h-full bg-red-500 rounded-full animate-pulse" />
            </div>
          </Marker>
        ) : null}

        <ResultMarkers results={results} category={category} />
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
        <UserLocationButton
          onClick={() => {
            if (mapRef.current && userLocation) {
              console.log('🎯 Centrage sur la position utilisateur');
              mapRef.current.getMap().flyTo({ 
                center: [userLocation[0], userLocation[1]], 
                zoom: 14,
                duration: 1000 
              });
            }
          }}
        />
      )}
    </div>
  );
}
