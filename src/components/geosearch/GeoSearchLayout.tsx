
import React, { useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MapView from './MapView';
// CORRECTION ICI : import par défaut
import GeoSearchHeader from './layout/GeoSearchHeader';
import { GeoSearchSidebarPopup } from './layout/GeoSearchSidebarPopup';
import { GeoSearchMobileResults } from './layout/GeoSearchMobileResults';
import EnhancedSearchBar from '../enhanced/EnhancedSearchBar';
import FiltersFloatingButton from './FiltersFloatingButton';
import EnhancedLocationButton from './EnhancedLocationButton';
import PrintButton from './PrintButton';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

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
    console.log('📍 Location sélectionnée:', location);
    setUserLocation(location.coordinates);
    performSearch(location.name);
  };

  const handleSearch = (query?: string) => {
    console.log('🔍 Recherche lancée:', query);
    if (query) {
      updateFilters({ query });
    }
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
    isReady: !!userLocation
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <MapView transport={filters.transport} />
          
          {/* Interface mobile avec recherche et contrôles repositionnés */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
            <div className="p-3 space-y-3">
              {/* Ligne 1: Menu burger */}
              <div className="flex items-center justify-between">
                <button 
                  className="w-10 h-10 bg-white shadow-md border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSidebarPopup(true)}
                >
                  <div className="w-4 h-4 flex flex-col justify-between">
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                  </div>
                </button>
                
                <div className="text-sm font-medium text-gray-600">
                  GeoSearch
                </div>
                
                <div className="w-10 h-10" /> {/* Spacer */}
              </div>
              
              {/* Ligne 2: Ma position */}
              <div className="flex justify-center">
                <EnhancedLocationButton
                  onLocationDetected={handleMyLocationClick}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="w-auto px-4"
                />
              </div>
              
              {/* Ligne 3: Barre de recherche repositionnée en dessous */}
              <EnhancedSearchBar
                value={filters.query || ''}
                onSearch={handleSearch}
                onLocationSelect={handleLocationSelect}
                isLoading={isLoading}
                placeholder="Rechercher un lieu..."
                className="w-full"
              />
              
              {/* Ligne 4: Contrôles filtres et navigation repositionnés */}
              <div className="flex items-center justify-center gap-2">
                <FiltersFloatingButton
                  filters={filters}
                  onChange={updateFilters}
                  onReset={resetFilters}
                  isLoading={isLoading}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="px-3"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <PrintButton results={results} />
              </div>
            </div>
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
        
        {/* Interface desktop avec recherche repositionnée */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
          <div className="p-4 max-w-4xl mx-auto space-y-3">
            {/* Ligne 1: Menu et titre */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  className="w-10 h-10 bg-white shadow-md border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSidebarPopup(true)}
                >
                  <div className="w-4 h-4 flex flex-col justify-between">
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                    <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
                  </div>
                </button>
                
                <h1 className="text-lg font-semibold text-gray-900">
                  Recherche géographique
                </h1>
              </div>
              
              <div className="text-sm text-gray-500">
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Ligne 2: Ma position repositionné */}
            <div className="flex justify-center">
              <EnhancedLocationButton
                onLocationDetected={handleMyLocationClick}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="w-auto px-6"
              />
            </div>
            
            {/* Ligne 3: Barre de recherche principale repositionnée en dessous */}
            <div className="max-w-2xl mx-auto">
              <EnhancedSearchBar
                value={filters.query || ''}
                onSearch={handleSearch}
                onLocationSelect={handleLocationSelect}
                isLoading={isLoading}
                placeholder="Rechercher un lieu, un type d'établissement..."
                className="w-full"
              />
            </div>
            
            {/* Ligne 4: Contrôles repositionnés */}
            <div className="flex items-center justify-center gap-3">
              <FiltersFloatingButton
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                isLoading={isLoading}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="px-3"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <PrintButton results={results} />
            </div>
          </div>
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
