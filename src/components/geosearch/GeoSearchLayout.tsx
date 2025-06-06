
import React from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import FloatingControls from './FloatingControls';
import PrintButton from './PrintButton';
import MultiMapToggle from './MultiMapToggle';
import { GeoSearchHeader } from './layout/GeoSearchHeader';
import { GeoSearchSidebarPopup } from './layout/GeoSearchSidebarPopup';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';

const GeoSearchLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    userLocation,
    filters,
    results,
    isLoading,
    networkStatus,
    updateFilters,
    resetFilters,
    performSearch,
    setUserLocation
  } = useGeoSearchStore();

  const [showSidebarPopup, setShowSidebarPopup] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = React.useState(false);

  // Show results panel when we have results
  React.useEffect(() => {
    setShowResults(results.length > 0);
    if (results.length > 0 && isMobile) {
      setIsResultsExpanded(false);
    }
  }, [results.length, isMobile]);

  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    console.log('📍 Location sélectionnée:', location);
    setUserLocation(location.coordinates);
  };

  const handleSearch = (query?: string) => {
    console.log('🔍 Recherche lancée:', query);
    performSearch(query);
  };

  const handleMyLocationClick = () => {
    console.log('📍 Demande de géolocalisation');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const statusInfo = {
    totalResults: results.length,
    hasResults: results.length > 0,
    isReady: true
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <GeoSearchHeader
          filters={filters}
          userLocation={userLocation}
          isLoading={isLoading}
          networkStatus={networkStatus}
          statusInfo={statusInfo}
        />

        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />
          
          {/* Barre de recherche en haut */}
          <div className="absolute top-2 left-2 right-2 z-50">
            <FloatingControls
              filters={filters}
              onLocationSelect={handleLocationSelect}
              onSearch={handleSearch}
              onMyLocationClick={handleMyLocationClick}
              onFiltersChange={updateFilters}
              onResetFilters={resetFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Boutons d'action en bas à droite */}
          <div className="absolute bottom-20 right-2 z-30 flex flex-col gap-2">
            <MultiMapToggle />
            <PrintButton results={results} />
          </div>

          <GeoSearchMobileResults
            results={results}
            isLoading={isLoading}
            showResults={showResults}
            isResultsExpanded={isResultsExpanded}
            statusInfo={statusInfo}
            onToggleExpanded={() => setIsResultsExpanded(!isResultsExpanded)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <MapView transport={filters.transport} />
        
        {/* Barre de recherche en haut */}
        <div className="absolute top-4 left-4 right-4 z-50 max-w-2xl">
          <FloatingControls
            filters={filters}
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            isLoading={isLoading}
          />
        </div>

        {/* Boutons d'action en bas à droite */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
          <MultiMapToggle />
          <PrintButton results={results} />
        </div>
      </div>

      <GeoSearchSidebarPopup
        filters={filters}
        userLocation={userLocation}
        results={results}
        isLoading={isLoading}
        statusInfo={statusInfo}
        onLocationSelect={handleLocationSelect}
        onSearch={handleSearch}
        onMyLocationClick={handleMyLocationClick}
        onFiltersChange={updateFilters}
        onResetFilters={resetFilters}
        open={showSidebarPopup}
        onOpenChange={setShowSidebarPopup}
      />
    </div>
  );
};

export default GeoSearchLayout;
