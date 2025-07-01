
import React, { useState, useEffect } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import GeoSearchHeader from './ui/GeoSearchHeader';
import GeoSearchSidebar from './ui/GeoSearchSidebar';
import GeoSearchMap from './ui/GeoSearchMap';
import GeoSearchMobilePanel from './ui/GeoSearchMobilePanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';

interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

interface StatusInfo {
  totalResults: number;
  hasResults: boolean;
  isReady: boolean;
  canSearch: boolean;
}

const GeoSearchApp: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);
  
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    mapboxError,
    networkStatus,
    updateFilters,
    resetFilters,
    performSearch,
    setUserLocation,
    initializeMapbox
  } = useGeoSearchStore();

  // Initialiser Mapbox au montage du composant
  useEffect(() => {
    console.log('🚀 Initialisation de l\'application GeoSearch');
    initializeMapbox();
  }, [initializeMapbox]);

  // Status info consolidé
  const statusInfo: StatusInfo = {
    totalResults: results.length,
    hasResults: results.length > 0,
    isReady: !!userLocation && isMapboxReady,
    canSearch: isMapboxReady && networkStatus === 'online'
  };

  const handleLocationSelect = (location: LocationSelectData): void => {
    setUserLocation(location.coordinates);
    performSearch(location.name);
  };

  const handleSearch = (query?: string): void => {
    if (query) {
      updateFilters({ query });
    }
    performSearch(query);
  };

  const handleMyLocationClick = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          console.log('📍 Position détectée:', coords);
          setUserLocation(coords);
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const handleToggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  // Affichage d'erreur si Mapbox non prêt
  if (!isMapboxReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {mapboxError ? (
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {mapboxError}
            </AlertDescription>
          </Alert>
        ) : (
          <EnhancedLoadingSpinner
            type="map"
            message="Initialisation des services de cartographie..."
            size="lg"
          />
        )}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Header mobile compact */}
        <GeoSearchHeader
          filters={filters}
          isLoading={isLoading}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          onMyLocationClick={handleMyLocationClick}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
          onToggleSidebar={handleToggleSidebar}
          isMobile={true}
          statusInfo={statusInfo}
        />

        {/* Carte plein écran */}
        <div className="flex-1 relative">
          <GeoSearchMap
            results={results}
            userLocation={userLocation}
            transport={filters.transport}
            category={filters.category}
          />
          
          {/* Panel mobile flottant pour résultats */}
          <GeoSearchMobilePanel
            results={results}
            isLoading={isLoading}
            isOpen={mobileResultsOpen}
            onToggle={() => setMobileResultsOpen(!mobileResultsOpen)}
            onResultSelect={handleLocationSelect}
          />
        </div>

        {/* Sidebar mobile en overlay */}
        {sidebarOpen && (
          <div className="absolute inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80">
              <GeoSearchSidebar
                filters={filters}
                results={results}
                userLocation={userLocation}
                isLoading={isLoading}
                statusInfo={statusInfo}
                onSearch={handleSearch}
                onLocationSelect={handleLocationSelect}
                onMyLocationClick={handleMyLocationClick}
                onFiltersChange={updateFilters}
                onResetFilters={resetFilters}
                onClose={() => setSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Version desktop
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      {sidebarOpen && (
        <div className="w-80 border-r">
          <GeoSearchSidebar
            filters={filters}
            results={results}
            userLocation={userLocation}
            isLoading={isLoading}
            statusInfo={statusInfo}
            onSearch={handleSearch}
            onLocationSelect={handleLocationSelect}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            onClose={() => setSidebarOpen(false)}
            isMobile={false}
          />
        </div>
      )}

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Header desktop */}
        <GeoSearchHeader
          filters={filters}
          isLoading={isLoading}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          onMyLocationClick={handleMyLocationClick}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
          onToggleSidebar={handleToggleSidebar}
          isMobile={false}
          statusInfo={statusInfo}
        />

        {/* Carte */}
        <div className="flex-1">
          <GeoSearchMap
            results={results}
            userLocation={userLocation}
            transport={filters.transport}
            category={filters.category}
          />
        </div>
      </div>
    </div>
  );
};

export default GeoSearchApp;
