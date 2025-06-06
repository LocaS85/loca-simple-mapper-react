
import React from 'react';
import { useGeoSearchCoordination } from '@/hooks/useGeoSearchCoordination';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import SearchHeader from './SearchHeader';
import FloatingControls from './FloatingControls';
import FiltersPopup from './FiltersPopup';
import EnhancedResultsList from '../enhanced/EnhancedResultsList';
import PrintButton from './PrintButton';
import MultiMapToggle from './MultiMapToggle';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const GeoSearchLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    userLocation,
    filters,
    results,
    isLoading,
    statusInfo,
    updateCoordinatedFilters,
    handleLocationSelect,
    handleSearch,
    handleMyLocationClick,
    loadResults
  } = useGeoSearchCoordination();

  const [showFilters, setShowFilters] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  // Show results panel when we have results
  React.useEffect(() => {
    setShowResults(results.length > 0);
  }, [results.length]);

  const handleFiltersChange = (newFilters: any) => {
    updateCoordinatedFilters(newFilters);
  };

  const handleResetFilters = () => {
    updateCoordinatedFilters({
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
      <div className="flex flex-col h-screen">
        {/* Mobile: Controls at top */}
        <div className="bg-white border-b z-30 relative">
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

        {/* Mobile: Map takes remaining space */}
        <div className="flex-1 relative">
          <MapView transport={filters.transport} />
          
          {/* Mobile: Floating action buttons */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
            <MultiMapToggle />
            <PrintButton results={results} />
          </div>

          {/* Mobile: Results drawer */}
          {showResults && (
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-xl shadow-lg max-h-80">
              <div className="p-4 border-b">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">Résultats ({results.length})</h3>
              </div>
              <ScrollArea className="max-h-64">
                <div className="p-4">
                  <EnhancedResultsList
                    results={results}
                    isLoading={isLoading}
                    onNavigate={(coords) => {
                      // Focus map on selected location
                      console.log('Navigate to:', coords);
                    }}
                    maxHeight="200px"
                  />
                </div>
              </ScrollArea>
            </div>
          )}
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

  // Desktop layout
  return (
    <div className="flex h-screen">
      {/* Desktop: Sidebar with search and results */}
      <div className="w-96 bg-white border-r flex flex-col">
        {/* Search controls */}
        <div className="p-4 border-b">
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

        {/* Results list */}
        <div className="flex-1 overflow-hidden">
          {statusInfo.hasResults ? (
            <div className="p-4 h-full">
              <EnhancedResultsList
                results={results}
                isLoading={isLoading}
                onNavigate={(coords) => {
                  console.log('Navigate to:', coords);
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📍
                </div>
                <h3 className="font-medium mb-2">Aucun résultat</h3>
                <p className="text-sm">
                  Recherchez un lieu ou sélectionnez une catégorie
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Map area */}
      <div className="flex-1 relative">
        <MapView transport={filters.transport} />
        
        {/* Desktop: Floating action buttons */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
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
