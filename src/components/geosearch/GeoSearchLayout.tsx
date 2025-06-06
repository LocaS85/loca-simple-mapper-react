
import React from 'react';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import FloatingControls from './FloatingControls';
import FiltersPopup from './FiltersPopup';
import PrintButton from './PrintButton';
import MultiMapToggle from './MultiMapToggle';
import { GeoSearchHeader } from './layout/GeoSearchHeader';
import { GeoSearchSidebar } from './layout/GeoSearchSidebar';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';

const GeoSearchLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    userLocation,
    filters,
    results,
    isLoading,
    statusInfo,
    networkStatus,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleMyLocationClick
  } = useGeoSearchManager();

  const [showFilters, setShowFilters] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = React.useState(false);

  // Show results panel when we have results
  React.useEffect(() => {
    setShowResults(statusInfo.hasResults);
    if (statusInfo.hasResults && isMobile) {
      setIsResultsExpanded(false); // Start collapsed on mobile
    }
  }, [statusInfo.hasResults, isMobile]);

  const handleFiltersChange = (newFilters: any) => {
    updateFiltersWithSearch(newFilters);
  };

  const handleResetFilters = () => {
    updateFiltersWithSearch({
      category: null,
      subcategory: null,
      transport: 'walking',
      distance: 10,
      unit: 'km',
      query: '',
      aroundMeCount: 3,
      showMultiDirections: false,
      maxDuration: 20
    });
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Mobile: Compact header */}
        <GeoSearchHeader
          filters={filters}
          userLocation={userLocation}
          isLoading={isLoading}
          networkStatus={networkStatus}
          statusInfo={statusInfo}
        />

        {/* Mobile: Enhanced search controls */}
        <div className="px-3 sm:px-4 py-2 bg-white border-b">
          <FloatingControls
            filters={filters}
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          />
        </div>

        {/* Mobile: Map container */}
        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />
          
          {/* Mobile: Floating action buttons */}
          <div className="absolute bottom-4 right-3 z-20 flex flex-col gap-2">
            <MultiMapToggle />
            <PrintButton results={results} />
          </div>

          {/* Mobile: Sliding results panel */}
          <GeoSearchMobileResults
            results={results}
            isLoading={isLoading}
            showResults={showResults}
            isResultsExpanded={isResultsExpanded}
            statusInfo={statusInfo}
            onToggleExpanded={() => setIsResultsExpanded(!isResultsExpanded)}
          />
        </div>

        {/* Mobile: Filters popup */}
        <FiltersPopup
          filters={filters}
          onChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
          open={showFilters}
          onReset={handleResetFilters}
        />
      </div>
    );
  }

  // Desktop layout - responsive improvements
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop: Enhanced sidebar */}
      <GeoSearchSidebar
        filters={filters}
        userLocation={userLocation}
        results={results}
        isLoading={isLoading}
        statusInfo={statusInfo}
        onLocationSelect={handleLocationSelect}
        onSearch={handleSearch}
        onMyLocationClick={handleMyLocationClick}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
      />

      {/* Desktop: Map area */}
      <div className="flex-1 relative overflow-hidden">
        <MapView transport={filters.transport} />
        
        {/* Desktop: Floating action buttons */}
        <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 z-20 flex flex-col gap-2 lg:gap-3">
          <MultiMapToggle />
          <PrintButton results={results} />
        </div>
      </div>

      {/* Desktop: Filters popup */}
      <FiltersPopup
        filters={filters}
        onChange={handleFiltersChange}
        onClose={() => setShowFilters(false)}
        open={showFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};

export default GeoSearchLayout;
