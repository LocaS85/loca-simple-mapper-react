
import React from 'react';
import { useGeoSearchManager } from '@/hooks/useGeoSearchManager';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
import FloatingControls from './FloatingControls';
import FiltersPopup from './FiltersPopup';
import EnhancedResultsList from '../enhanced/EnhancedResultsList';
import PrintButton from './PrintButton';
import MultiMapToggle from './MultiMapToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, WifiOff, Search, ChevronUp, ChevronDown } from 'lucide-react';

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
  }, [statusInfo.hasResults]);

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

  // Status indicator component
  const StatusIndicator = () => (
    <div className="flex items-center gap-2">
      {networkStatus === 'online' ? (
        <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
      ) : (
        <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
      )}
      <span className="text-xs text-muted-foreground">
        {isLoading ? 'Recherche...' : 
         statusInfo.hasResults ? `${statusInfo.totalResults} résultat${statusInfo.totalResults > 1 ? 's' : ''}` :
         'Prêt'}
      </span>
    </div>
  );

  // Active filters display
  const ActiveFilters = () => {
    const hasActiveFilters = filters.category || filters.transport !== 'walking' || filters.distance !== 10;
    
    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-blue-50 rounded-lg">
        {filters.category && (
          <Badge variant="secondary" className="text-xs">
            📍 {filters.category}
          </Badge>
        )}
        {filters.transport !== 'walking' && (
          <Badge variant="secondary" className="text-xs">
            🚶 {filters.transport}
          </Badge>
        )}
        {filters.distance !== 10 && (
          <Badge variant="secondary" className="text-xs">
            📏 {filters.distance} {filters.unit}
          </Badge>
        )}
        {filters.maxDuration !== 20 && (
          <Badge variant="secondary" className="text-xs">
            ⏱️ {filters.maxDuration} min
          </Badge>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Mobile: Compact header */}
        <div className="bg-white border-b shadow-sm z-30 p-3 sm:p-4 flex-shrink-0">
          <div className="space-y-2 sm:space-y-3">
            <FloatingControls
              filters={filters}
              onLocationSelect={handleLocationSelect}
              onSearch={handleSearch}
              onMyLocationClick={handleMyLocationClick}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              isLoading={isLoading}
            />
            <div className="flex items-center justify-between">
              <StatusIndicator />
              {userLocation && (
                <Badge variant="outline" className="text-xs">
                  📍 Position OK
                </Badge>
              )}
            </div>
            <ActiveFilters />
          </div>
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
          {showResults && (
            <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-xl shadow-2xl border-t transition-all duration-300 ${
              isResultsExpanded ? 'h-3/4' : 'h-48'
            }`}>
              <div 
                className="p-3 sm:p-4 border-b bg-gray-50 cursor-pointer"
                onClick={() => setIsResultsExpanded(!isResultsExpanded)}
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Résultats trouvés
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {statusInfo.totalResults}
                    </Badge>
                    {isResultsExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4">
                    <EnhancedResultsList
                      results={results}
                      isLoading={isLoading}
                      onNavigate={(coords) => {
                        console.log('Navigate to:', coords);
                      }}
                    />
                  </div>
                </ScrollArea>
              </div>
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

  // Desktop layout - responsive improvements
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop: Enhanced sidebar with responsive width */}
      <div className="w-80 lg:w-96 bg-white border-r shadow-sm flex flex-col flex-shrink-0">
        {/* Search controls */}
        <Card className="m-3 lg:m-4 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Search className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
              Recherche géographique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4">
            <FloatingControls
              filters={filters}
              onLocationSelect={handleLocationSelect}
              onSearch={handleSearch}
              onMyLocationClick={handleMyLocationClick}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              isLoading={isLoading}
            />
            
            <div className="flex items-center justify-between pt-2 border-t">
              <StatusIndicator />
              {userLocation && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Position OK
                </Badge>
              )}
            </div>
            
            <ActiveFilters />
          </CardContent>
        </Card>

        {/* Results section with improved responsive design */}
        <div className="flex-1 overflow-hidden mx-3 lg:mx-4 mb-3 lg:mb-4">
          {statusInfo.hasResults ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="text-sm lg:text-base flex items-center justify-between">
                  <span>Résultats de recherche</span>
                  <Badge variant="secondary" className="text-xs">
                    {statusInfo.totalResults}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full">
                  <EnhancedResultsList
                    results={results}
                    isLoading={isLoading}
                    onNavigate={(coords) => {
                      console.log('Navigate to:', coords);
                    }}
                    className="px-4 lg:px-6"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center p-4 lg:p-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
                  </div>
                  <h3 className="font-medium mb-2 text-gray-900 text-sm lg:text-base">
                    Prêt à rechercher
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-500 max-w-xs">
                    Saisissez un terme de recherche ou sélectionnez une catégorie pour commencer
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Desktop: Map area with responsive design */}
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
