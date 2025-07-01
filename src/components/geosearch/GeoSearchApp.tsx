
import React, { useState, useEffect } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import GeoSearchHeader from './ui/GeoSearchHeader';
import GeoSearchSidebar from './ui/GeoSearchSidebar';
import GeoSearchMap from './ui/GeoSearchMap';
import GeoSearchMobilePanel from './ui/GeoSearchMobilePanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';
import RouteBackButton from '@/components/ui/RouteBackButton';

interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

interface StatusInfo {
  totalResults: number;
  hasResults: boolean;
  isReady: boolean;
  canSearch: boolean;
}

const GeoSearchApp: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);
  
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    mapboxError,
    networkStatus,
    updateFilters,
    resetFilters,
    performSearch,
    setUserLocation,
    initializeMapbox
  } = useGeoSearchStore();

  // Initialiser Mapbox au montage du composant
  useEffect(() => {
    console.log('🚀 Initialisation de l\'application GeoSearch');
    
    // FORCER LA RÉINITIALISATION DE LA POSITION
    setUserLocation(null);
    console.log('🔄 Position utilisateur réinitialisée');
    
    initializeMapbox().then(() => {
      // Ne pas faire de recherche auto si pas de position valide
      console.log('🗺️ Mapbox initialisé, attente géolocalisation utilisateur');
    });
  }, [initializeMapbox, setUserLocation]);

  // Auto-trigger search when user location is available
  useEffect(() => {
    if (userLocation && isMapboxReady && !results.length && !isLoading) {
      console.log('🔍 Auto-search triggered pour nouvelle position');
      performSearch('restaurant');
    }
  }, [userLocation, isMapboxReady]);

  // Status info simplifié
  const statusInfo: StatusInfo = {
    totalResults: results.length,
    hasResults: results.length > 0,
    isReady: !!userLocation && isMapboxReady,
    canSearch: isMapboxReady
  };

  const handleLocationSelect = (location: LocationSelectData): void => {
    setUserLocation(location.coordinates);
    performSearch(location.name);
  };

  const handleSearch = (query?: string): void => {
    if (query) {
      updateFilters({ query });
    }
    performSearch(query);
  };

  const handleMyLocationClick = (): void => {
    console.log('🎯 Demande de géolocalisation FORCÉE...');
    
    // Réinitialiser la position d'abord
    setUserLocation(null);
    console.log('🔄 Position actuelle effacée');
    
    if (navigator.geolocation) {
      console.log('📡 Début géolocalisation avec haute précision...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          console.log('📍 NOUVELLE position détectée:', coords);
          console.log('📍 Précision:', position.coords.accuracy, 'mètres');
          setUserLocation(coords);
          console.log('💾 Position stockée dans le store:', coords);
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error);
          console.error('❌ Code erreur:', error.code);
          console.error('❌ Message:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // FORCER UNE NOUVELLE POSITION
        }
      );
    } else {
      console.error('❌ Géolocalisation non supportée');
    }
  };

  const handleToggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  // Affichage d'erreur si Mapbox non prêt
  if (!isMapboxReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {mapboxError ? (
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {mapboxError}
            </AlertDescription>
          </Alert>
        ) : (
          <EnhancedLoadingSpinner
            type="map"
            message="Initialisation des services de cartographie..."
            size="lg"
          />
        )}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Header mobile simplifié */}
        <div className="bg-white border-b shadow-sm z-40">
          <div className="flex items-center gap-3 p-4">
            <RouteBackButton
              route="/categories"
              variant="ghost"
              size="sm"
              showLabel={false}
              className="shrink-0"
            />
            <h1 className="text-lg font-semibold text-foreground">GeoSearch</h1>
          </div>
          
          <GeoSearchHeader
            filters={filters}
            isLoading={isLoading}
            onSearch={handleSearch}
            onLocationSelect={handleLocationSelect}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            onToggleSidebar={handleToggleSidebar}
            isMobile={true}
            statusInfo={statusInfo}
          />
        </div>

        {/* Carte plein écran */}
        <div className="flex-1 relative">
          <GeoSearchMap
            results={results}
            userLocation={userLocation}
            transport={filters.transport}
            category={filters.category}
          />
          
          {/* Panel mobile pour résultats */}
          {results.length > 0 && (
            <GeoSearchMobilePanel
              results={results}
              isLoading={isLoading}
              isOpen={mobileResultsOpen}
              onToggle={() => setMobileResultsOpen(!mobileResultsOpen)}
              onResultSelect={handleLocationSelect}
            />
          )}
        </div>

        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div className="absolute inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw]">
              <GeoSearchSidebar
                filters={filters}
                results={results}
                userLocation={userLocation}
                isLoading={isLoading}
                statusInfo={statusInfo}
                onSearch={handleSearch}
                onLocationSelect={handleLocationSelect}
                onMyLocationClick={handleMyLocationClick}
                onFiltersChange={updateFilters}
                onResetFilters={resetFilters}
                onClose={() => setSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Version desktop simplifiée
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Header desktop */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <RouteBackButton
            route="/categories"
            variant="ghost"
            size="sm"
            label="Catégories"
            className="shrink-0"
          />
          <h1 className="text-xl font-semibold text-foreground">Recherche Géographique</h1>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex w-full h-full pt-16">
        {/* Sidebar desktop */}
        {sidebarOpen && (
          <div className="w-80 border-r bg-white shadow-sm">
            <GeoSearchSidebar
              filters={filters}
              results={results}
              userLocation={userLocation}
              isLoading={isLoading}
              statusInfo={statusInfo}
              onSearch={handleSearch}
              onLocationSelect={handleLocationSelect}
              onMyLocationClick={handleMyLocationClick}
              onFiltersChange={updateFilters}
              onResetFilters={resetFilters}
              onClose={() => setSidebarOpen(false)}
              isMobile={false}
            />
          </div>
        )}

        {/* Zone principale */}
        <div className="flex-1 flex flex-col">
          {/* Header de recherche */}
          <GeoSearchHeader
            filters={filters}
            isLoading={isLoading}
            onSearch={handleSearch}
            onLocationSelect={handleLocationSelect}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            onToggleSidebar={handleToggleSidebar}
            isMobile={false}
            statusInfo={statusInfo}
          />

          {/* Carte */}
          <div className="flex-1">
            <GeoSearchMap
              results={results}
              userLocation={userLocation}
              transport={filters.transport}
              category={filters.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoSearchApp;
