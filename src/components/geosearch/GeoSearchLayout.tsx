
import React, { useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import { GeoSearchSidebarPopup } from './layout/GeoSearchSidebarPopup';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';
import GeoSearchMobileHeader from './layout/GeoSearchMobileHeader';
import GeoSearchDesktopHeader from './layout/GeoSearchDesktopHeader';

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

  const [showSidebarPopup, setShowSidebarPopup] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);

  // Show results panel when we have results
  React.useEffect(() => {
    setShowResults(results.length > 0);
    if (results.length > 0 && isMobile) {
      setIsResultsExpanded(false);
    }
  }, [results.length, isMobile]);

  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    setUserLocation(location.coordinates);
    performSearch(location.name);
  };

  const handleSearch = (query?: string) => {
    if (query) {
      updateFilters({ query });
    }
    performSearch(query);
  };

  const handleMyLocationClick = () => {
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
          // Ici, on peut ajouter toast ou notification...
          console.error('❌ Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const statusInfo = {
    totalResults: results.length,
    hasResults: results.length > 0,
    isReady: !!userLocation
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />

          <GeoSearchMobileHeader
            isLoading={isLoading}
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            results={results}
            handleMyLocationClick={handleMyLocationClick}
            handleSearch={handleSearch}
            handleLocationSelect={handleLocationSelect}
            setShowSidebarPopup={setShowSidebarPopup}
          />

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <MapView transport={filters.transport} />

        <GeoSearchDesktopHeader
          isLoading={isLoading}
          filters={filters}
          results={results}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          handleMyLocationClick={handleMyLocationClick}
          handleSearch={handleSearch}
          handleLocationSelect={handleLocationSelect}
          setShowSidebarPopup={setShowSidebarPopup}
        />
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

// FICHIER DE PLUS DE 150 LIGNES : PENSEZ À UNE NOUVELLE FRACTIONNATION APRÈS VALIDATION.
