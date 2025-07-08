
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MaximizedGeoSearchLayout from './ui/MaximizedGeoSearchLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';

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
  const navigate = useNavigate();
  
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

  const handleBackToCategories = (): void => {
    navigate('/categories');
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

  // Interface maximisée unifiée
  return (
    <MaximizedGeoSearchLayout
      filters={filters}
      results={results}
      userLocation={userLocation}
      isLoading={isLoading}
      onSearch={handleSearch}
      onLocationSelect={handleLocationSelect}
      onMyLocationClick={handleMyLocationClick}
      onFiltersChange={updateFilters}
      onResetFilters={resetFilters}
      onBack={handleBackToCategories}
    />
  );
};

export default GeoSearchApp;
