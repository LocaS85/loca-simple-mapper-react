
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Category } from '@/types/category';
import { TransportMode, DistanceUnit } from '@/types/map';

// Define custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',
  iconReactUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbD0iIzMzNzNkYyIgZD0iTTEyLjUgMEMxOS40MDMgMCAyNSA1LjU5NyAyNSAxMi41UzE5LjQwMyAyNSAxMi41IDI1UzAgMTkuNDAzIDAgMTIuNVM1LjU5NyAwIDEyLjUgMFoiLz4KPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyLjUgNkM5Ljc0IDYgNy41IDguMjQgNy41IDExUzcuNSAxNi4wMyA3LjUgMTYuMDNMMTIuNSAyNUwxNy41IDE2LjAzUzE3LjUgMTEgMTcuNSAxMUMxNy41IDguMjQgMTUuMjYgNiAxMi41IDZaTTEyLjUgMTNDMTEuNCAxMyAxMC41IDEyLjEgMTAuNSAxMUMxMC41IDkuOSAxMS40IDkgMTIuNSA5UzE0LjUgOS45IDE0LjUgMTFDMTQuNSAxMi4xIDEzLjYgMTMgMTIuNSAxM1oiLz4KPC9zdmc+",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CategoryMapViewProps {
  selectedCategory?: { id: string; name: string; color: string; icon: string; subcategories: any[] } | null;
  initialTransportMode?: TransportMode;
  initialMaxDistance?: number;
  initialMaxDuration?: number;
  initialAroundMeCount?: number;
  initialDistanceUnit?: DistanceUnit;
}

const CategoryMapView: React.FC<CategoryMapViewProps> = ({
  selectedCategory,
  initialTransportMode = 'walking',
  initialMaxDistance = 10,
  initialMaxDuration = 60,
  initialAroundMeCount = 5,
  initialDistanceUnit = 'km'
}) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user location
  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setCurrentLocation([48.8566, 2.3522]); // Paris par défaut
        setIsLoading(false);
      }
    );
  }, []);

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        {isLoading ? (
          <p>Chargement de votre position...</p>
        ) : (
          <p>Carte indisponible</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={currentLocation} icon={customMarkerIcon}>
          <Popup>
            Vous êtes ici.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CategoryMapView;
