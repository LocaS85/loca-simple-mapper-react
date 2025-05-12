
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState, useEffect } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl';
import { LocateFixed, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 12,
  });

  const mapRef = useRef<any>(null);
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Obtain the user's position
  useEffect(() => {
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
      }
    );
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

  return (
    <div className="relative w-full h-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg"
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => setViewport(evt.viewState)}
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
            <MapPin className="text-blue-500 w-6 h-6" />
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
