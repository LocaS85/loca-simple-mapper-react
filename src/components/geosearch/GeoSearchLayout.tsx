
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

  const handleMyLocationClick = (coordinates: [number, number]) => {
    setUserLocation(coordinates);
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
          {/* Map avec marge augmentée pour éviter superposition */}
          <div className="absolute inset-0" style={{ paddingTop: '260px' }}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0" style={{ 
                paddingLeft: '12px', 
                paddingRight: '120px', // Marge droite pour éviter les contrôles zoom
                paddingTop: '12px',
                paddingBottom: showResults ? (isResultsExpanded ? '60%' : '220px') : '100px'
              }}>
                <MapView transport={filters.transport} />
              </div>
            </div>
          </div>

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
        {/* Map avec marges améliorées pour éviter les superpositions */}
        <div className="absolute inset-0" style={{ 
          paddingTop: '200px',
          paddingRight: '140px', // Marge droite augmentée pour éviter les contrôles zoom
          paddingLeft: '12px',
          paddingBottom: '12px'
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
