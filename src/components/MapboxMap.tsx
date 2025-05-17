
import React, { useRef, useState, useEffect } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl';
import { LocateFixed, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getMapboxToken, isMapboxTokenValid, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { useIsMobile } from '@/hooks/use-mobile';

interface MapboxMapProps {
  results?: any[];
  transport?: string;
  radius?: number;
  count?: number;
  category?: string;
}

export default function MapboxMap({ 
  results = [], 
  transport = "Voiture", 
  radius = 5,
  category = ""
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get Mapbox token from environment variables
  const mapboxToken = getMapboxToken();

  // Obtain the user's position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setViewport({ ...viewport, latitude: lat, longitude: lng });
          setUserLocation({ lat, lng });
        },
        (err) => {
          console.error('Erreur géolocalisation :', err);
          toast({
            title: "Localisation",
            description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
            variant: "destructive",
          });
        },
        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, [toast]);

  // Helper to get color based on category
  const getColorForCategory = (cat: string) => {
    switch (cat) {
      case 'Divertissement':
        return '#8e44ad'; 
      case 'Santé':
        return '#27ae60';
      case 'Alimentation':
        return '#e67e22';
      default:
        return '#3498db';
    }
  };

  // Check if Mapbox token is available
  if (!isMapboxTokenValid()) {
    return <MapboxError onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          ...viewport,
          zoom: isMobile ? viewport.zoom - 1 : viewport.zoom // Smaller zoom on mobile
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => setViewport(evt.viewState)}
        onError={(e) => {
          console.error("Mapbox error:", e);
          setMapError(e.error?.message || "Error loading map");
        }}
      >
        {/* Navigation (zoom) */}
        <NavigationControl position="top-left" />
        
        {/* User location control */}
        <GeolocateControl
          position="top-left"
          trackUserLocation
          showAccuracyCircle={false}
        />

        {/* User position marker */}
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center p-1">
                <MapPin className="text-white w-4 h-4" />
              </div>
              <div className="text-xs font-bold bg-white px-1 rounded shadow-sm">
                Vous
              </div>
            </div>
          </Marker>
        )}

        {/* Result markers */}
        {results.map((result, index) => (
          result.lng && result.lat && (
            <Marker 
              key={index}
              longitude={result.lng} 
              latitude={result.lat} 
              anchor="bottom"
            >
              <MapPin 
                className="w-6 h-6" 
                style={{ color: getColorForCategory(result.type || category) }} 
              />
            </Marker>
          )
        ))}
      </Map>

      {/* Error overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-600 font-semibold">{mapError}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Recharger la carte
            </button>
          </div>
        </div>
      )}

      {/* Floating "my position" button */}
      <button
        className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
        onClick={() => {
          if (userLocation && mapRef.current) {
            mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14 });
          }
        }}
        aria-label="Centrer sur ma position"
      >
        <LocateFixed className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
