
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
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />
          
          {/* Barre de recherche avec menu burger - Position fixe - Tailles réduites */}
          <div className="absolute top-3 left-3 right-3 z-[100]">
            <div className="flex items-center gap-2">
              {/* Menu burger réduit - même hauteur que les contrôles */}
              <button 
                className="flex-shrink-0 w-8 h-8 bg-white shadow-lg border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                onClick={() => setShowSidebarPopup(true)}
              >
                <div className="w-3 h-3 flex flex-col justify-between">
                  <div className="w-full h-0.5 bg-gray-700"></div>
                  <div className="w-full h-0.5 bg-gray-700"></div>
                  <div className="w-full h-0.5 bg-gray-700"></div>
                </div>
              </button>
              
              {/* Barre de recherche réduite */}
              <div className="flex-1 h-8">
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
            </div>
          </div>

          {/* Boutons d'action en bas à droite */}
          <div className="absolute bottom-20 right-3 z-30 flex flex-col gap-2">
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
        
        {/* Barre de recherche avec menu burger - Desktop - Tailles réduites */}
        <div className="absolute top-4 left-4 right-4 z-[100]">
          <div className="flex items-start gap-3 max-w-2xl">
            {/* Menu burger réduit - même style que les contrôles */}
            <button 
              className="flex-shrink-0 w-9 h-9 bg-white shadow-lg border-2 border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
              onClick={() => setShowSidebarPopup(true)}
            >
              <div className="w-4 h-4 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
              </div>
            </button>
            
            {/* Barre de recherche proportionnelle */}
            <div className="flex-1 h-9">
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
          </div>
        </div>

        {/* Boutons d'action - Desktop */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3">
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
