
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/types/map';
import { Button } from "@/components/ui/button";
import { LocateFixed } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from '@/store/geoSearchStore/searchLogic';
import { EnhancedLocationButton } from '@/components/map';

// Define custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  results?: SearchResult[];
  userLocation?: [number, number];
  selectedResult?: SearchResult | null;
  onMarkerClick?: (result: SearchResult) => void;
  onLocationUpdate?: (location: [number, number]) => void;
  showRoutes?: boolean;
  transport?: TransportMode;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  results = [],
  userLocation,
  selectedResult,
  onMarkerClick,
  onLocationUpdate,
  showRoutes = false,
  transport = 'walking',
  className = ''
}) => {
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  // Function to handle location detection
  const handleLocationDetected = (coordinates: [number, number]) => {
    console.log('📍 Location detected:', coordinates);
    if (onLocationUpdate) {
      onLocationUpdate(coordinates);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Enhanced Location Button */}
      <div className="absolute top-4 right-4 z-10">
        <EnhancedLocationButton
          onLocationDetected={handleLocationDetected}
          disabled={false}
          variant="outline"
          size="sm"
          icon="mappin"
          className="bg-white shadow-md"
        />
      </div>

      <MapContainer
        center={userLocation || [48.8566, 2.3522]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {userLocation && (
          <Marker position={userLocation} icon={customMarkerIcon}>
            <Popup>Votre position</Popup>
          </Marker>
        )}

        {results.map((result) => (
          <Marker
            key={result.id}
            position={result.coordinates.slice().reverse() as [number, number]}
            icon={customMarkerIcon}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(result);
                }
              },
            }}
          >
            <Popup>
              {result.name}
              <br />
              {result.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
