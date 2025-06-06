
import React from 'react';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
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
    statusInfo,
    networkStatus,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleMyLocationClick
  } = useGeoSearchManager();

  const [showSidebarPopup, setShowSidebarPopup] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = React.useState(false);

  // Show results panel when we have results
  React.useEffect(() => {
    setShowResults(statusInfo.hasResults);
    if (statusInfo.hasResults && isMobile) {
      setIsResultsExpanded(false);
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
        <GeoSearchHeader
          filters={filters}
          userLocation={userLocation}
          isLoading={isLoading}
          networkStatus={networkStatus}
          statusInfo={statusInfo}
        />

        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />
          
          <div className="absolute top-4 left-4 right-4 z-20">
            <FloatingControls
              filters={filters}
              onLocationSelect={handleLocationSelect}
              onSearch={handleSearch}
              onMyLocationClick={(coords) => handleMyLocationClick()}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              isLoading={isLoading}
            />
          </div>

          <div className="absolute bottom-4 right-3 z-20 flex flex-col gap-2">
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <MapView transport={filters.transport} />
        
        <div className="absolute top-4 left-4 right-4 z-20">
          <FloatingControls
            filters={filters}
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onMyLocationClick={(coords) => handleMyLocationClick()}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          />
        </div>

        <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 z-20 flex flex-col gap-2 lg:gap-3">
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
        onMyLocationClick={() => handleMyLocationClick()}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        open={showSidebarPopup}
        onOpenChange={setShowSidebarPopup}
      />
    </div>
  );
};

export default GeoSearchLayout;
