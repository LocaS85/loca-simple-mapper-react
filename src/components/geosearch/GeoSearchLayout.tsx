
import React, { useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import { GeoSearchSidebarPopup } from './layout/GeoSearchSidebarPopup';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';
import GeoSearchMobileHeader from './layout/GeoSearchMobileHeader';
import GeoSearchDesktopHeader from './layout/GeoSearchDesktopHeader';
import { LocationButton } from '@/components/shared';

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
          {/* Map avec marges optimisées pour mobile */}
          <div className="absolute inset-0" style={{ paddingTop: '240px' }}>
            <div className="relative h-full w-full">
              <div className="absolute inset-0" style={{ 
                paddingLeft: '8px', 
                paddingRight: '80px', // Espace pour les contrôles zoom
                paddingTop: '8px',
                paddingBottom: showResults ? (isResultsExpanded ? '60%' : '200px') : '80px'
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
            handleMyLocationClick={() => {
              // Utilisation du LocationButton component pour la géolocalisation
            }}
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
            onMyLocationClick={() => {
              // Utilisation du LocationButton component pour la géolocalisation
            }}
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
        {/* Map avec marges optimisées pour desktop */}
        <div className="absolute inset-0" style={{ 
          paddingTop: '180px',
          paddingRight: '120px', // Espace pour les contrôles zoom
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
          handleMyLocationClick={() => {
            // Utilisation du LocationButton component pour la géolocalisation
          }}
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
          onMyLocationClick={() => {
            // Utilisation du LocationButton component pour la géolocalisation
          }}
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
