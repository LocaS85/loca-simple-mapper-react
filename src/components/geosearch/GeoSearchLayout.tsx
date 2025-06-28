
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGeoSearch } from '@/hooks/geosearch/useGeoSearch';
import GeoSearchMobileHeader from './layout/GeoSearchMobileHeader';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';
import GeoSearchSidebarPopup from './layout/GeoSearchSidebarPopup';
import FloatingControls from './FloatingControls';

const GeoSearchLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  const {
    searchQuery,
    setSearchQuery,
    userLocation,
    filters,
    results,
    isLoading,
    statusInfo,
    handleSearch,
    handleLocationSelect,
    updateFiltersWithSearch,
    resetFilters,
    setUserLocation
  } = useGeoSearch();

  const [showSidebarPopup, setShowSidebarPopup] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);

  // Gérer l'affichage des résultats
  useEffect(() => {
    setShowResults(results.length > 0 && !isLoading);
  }, [results.length, isLoading]);

  // Auto-collapse results when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsResultsExpanded(false);
    }
  }, [isMobile]);

  const handleLocationClick = () => {
    if (userLocation) {
      handleSearch();
    }
  };

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <GeoSearchMobileHeader
          isLoading={isLoading}
          filters={filters}
          updateFilters={updateFiltersWithSearch}
          resetFilters={resetFilters}
          results={results}
          handleMyLocationClick={handleLocationClick}
          handleSearch={handleSearch}
          handleLocationSelect={handleLocationSelect}
          setShowSidebarPopup={setShowSidebarPopup}
        />
      )}

      {/* Map Container - Adjusted margins for mobile */}
      <div 
        className={`
          w-full h-full bg-white flex items-center justify-center
          ${isMobile ? 'mt-32 mb-4' : 'mt-0 mb-0'}
        `}
        id="geo-map-container"
      >
        <div className="text-gray-500 text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Carte Interactive</h3>
          <p className="text-sm text-gray-400">
            L'interface de carte sera intégrée ici
          </p>
          {userLocation && (
            <p className="text-xs text-green-600 mt-2">
              Position: {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Results Panel */}
      {isMobile && showResults && (
        <GeoSearchMobileResults
          results={results}
          isLoading={isLoading}
          showResults={showResults}
          isResultsExpanded={isResultsExpanded}
          statusInfo={statusInfo}
          onToggleExpanded={() => setIsResultsExpanded(!isResultsExpanded)}
        />
      )}

      {/* Desktop Floating Controls */}
      {!isMobile && (
        <FloatingControls
          filters={filters}
          results={results}
          isLoading={isLoading}
          updateFilters={updateFiltersWithSearch}
          resetFilters={resetFilters}
        />
      )}

      {/* Sidebar Popup */}
      <GeoSearchSidebarPopup
        open={showSidebarPopup}
        onClose={() => setShowSidebarPopup(false)}
        results={results}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFiltersWithSearch}
      />
    </div>
  );
};

export default GeoSearchLayout;
