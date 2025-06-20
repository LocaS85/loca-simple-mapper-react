
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
          console.log('📍 Position détectée:', coords);
          setUserLocation(coords);
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error);
          // Fallback vers une position par défaut (Paris)
          const fallbackCoords: [number, number] = [2.3522, 48.8566];
          console.log('📍 Utilisation position par défaut:', fallbackCoords);
          setUserLocation(fallbackCoords);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.warn('Géolocalisation non supportée');
      // Fallback vers Paris
      const fallbackCoords: [number, number] = [2.3522, 48.8566];
      setUserLocation(fallbackCoords);
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
          {/* Map avec marge pour le header augmentée */}
          <div className="absolute inset-0" style={{ paddingTop: '240px' }}>
            <div className="relative h-full w-full">
              {/* Zone de carte avec marges pour éviter les superpositions */}
              <div className="absolute inset-0" style={{ 
                paddingLeft: '8px', 
                paddingRight: '8px', 
                paddingTop: '8px',
                paddingBottom: showResults ? (isResultsExpanded ? '60%' : '200px') : '80px'
              }}>
                <MapView transport={filters.transport} />
              </div>
            </div>
          </div>

          {/* Header fixe en haut */}
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

          {/* Résultats en bas */}
          <GeoSearchMobileResults
            results={results}
            isLoading={isLoading}
            showResults={showResults}
            isResultsExpanded={isResultsExpanded}
            statusInfo={statusInfo}
            onToggleExpanded={() => setIsResultsExpanded(!isResultsExpanded)}
          />

          {/* Sidebar popup */}
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
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {/* Map avec marge pour le header desktop et éviter superposition */}
        <div className="absolute inset-0" style={{ 
          paddingTop: '180px',
          paddingRight: '120px', // Marge droite pour éviter les contrôles de zoom
          paddingLeft: '8px',
          paddingBottom: '8px'
        }}>
          <MapView transport={filters.transport} />
        </div>

        <GeoSearchDesktopHeader
          isLoading={isLoading}
          filters={filters}
          results={results}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          handleMyLocationClick={handleMyLocationClick}
          handleSearch={handleSearch}
          handleLocationSelect={handleLocationSelect}
          onFiltersClick={() => setShowSidebarPopup(true)}
        />

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
    </div>
  );
};

export default GeoSearchLayout;
