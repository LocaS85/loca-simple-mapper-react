
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Category } from '@/types/category';
import { TransportMode } from '@/types/map';
import { useCategoryManagement } from '@/hooks/use-category-management';
import { useMapSettings } from '@/hooks/use-map-settings';
import { useDebounce } from '@/hooks/useDebounce';
import { getCategoryById } from '@/utils/categoryConverter';
import FilterBar from '@/components/FilterBar';

// Define custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CategoryMapViewProps {
  initialCategory?: string;
  initialTransportMode?: TransportMode;
  initialMaxDistance?: number;
  initialMaxDuration?: number;
  initialAroundMeCount?: number;
  initialDistanceUnit?: 'km' | 'miles';
}

const CategoryMapView: React.FC<CategoryMapViewProps> = ({
  initialCategory,
  initialTransportMode,
  initialMaxDistance,
  initialMaxDuration,
  initialAroundMeCount,
  initialDistanceUnit
}) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: initialCategory || '',
    transportMode: initialTransportMode || 'car',
    maxDistance: initialMaxDistance || 10,
    maxDuration: initialMaxDuration || 60,
    aroundMeCount: initialAroundMeCount || 5,
    showMultiDirections: false,
    distanceUnit: initialDistanceUnit || 'km'
  });

  // Category Management Hook
  const { categories, selectedCategory, selectCategory, clearSelection } = useCategoryManagement();

  // Map Settings Hook
  const { mapZoom, setMapZoom, mapCenter, setMapCenter } = useMapSettings();

  // Debounce for location changes
  const debouncedLocation = useDebounce(currentLocation, 500);

  // Load initial category from URL
  useEffect(() => {
    if (initialCategory) {
      selectCategory(initialCategory);
    }
  }, [initialCategory, selectCategory]);

  // Handle filter changes
  const onFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get current location
  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setUserLocation([latitude, longitude]);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
      }
    );
  }, []);

  // Update map center when debounced location changes
  useEffect(() => {
    if (debouncedLocation) {
      setMapCenter(debouncedLocation);
    }
  }, [debouncedLocation, setMapCenter]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">
            {selectedCategory ? `Carte des ${selectedCategory.name}` : 'Carte interactive'}
          </h1>
        </div>

        <FilterBar
          onFilterChange={onFilterChange}
          filters={{
            category: filters.category,
            transportMode: filters.transportMode,
            maxDistance: filters.maxDistance,
            maxDuration: filters.maxDuration,
            aroundMeCount: filters.aroundMeCount,
            showMultiDirections: filters.showMultiDirections,
            distanceUnit: filters.distanceUnit
          }}
          userLocation={userLocation}
          isLoading={isLoading}
          currentLocation={currentLocation}
          initialCategory={initialCategory}
          initialTransportMode={initialTransportMode}
          initialMaxDistance={initialMaxDistance}
          initialMaxDuration={initialMaxDuration}
          initialAroundMeCount={initialAroundMeCount}
          initialDistanceUnit={initialDistanceUnit}
        />
      </div>

      {/* Map */}
      <div className="flex-grow relative">
        {currentLocation ? (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
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
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            {isLoading ? (
              <p>Chargement de votre position...</p>
            ) : (
              <p>Veuillez activer la géolocalisation pour afficher la carte.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMapView;
