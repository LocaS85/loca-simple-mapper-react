import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import GoogleMapsLayout from './GoogleMapsLayout';
import MapboxTokenSetup from './ui/MapboxTokenSetup';
import RouteBackButton from '@/components/ui/RouteBackButton';
import Logo from '@/components/ui/Logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { mapboxConfigService } from '@/services/mapboxConfigService';

const GeoSearchApp: React.FC = () => {
  const navigate = useNavigate();
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    mapboxError,
    updateFilters,
    resetFilters,
    performSearch,
    setUserLocation,
    initializeMapbox
  } = useGeoSearchStore();

  // Initialisation de l'application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initialisation GeoSearchApp...');
        
        // Vérifier token Mapbox
        try {
          await mapboxConfigService.getMapboxToken();
        } catch (error) {
          console.warn('Token Mapbox non disponible, affichage du setup');
          setShowTokenSetup(true);
          return;
        }

        // Initialiser filtres depuis URL
        const urlParams = new URLSearchParams(window.location.search);
        const params: Record<string, string> = {};
        urlParams.forEach((value, key) => {
          params[key] = value;
        });
        
        if (Object.keys(params).length > 0) {
          if (params.lat && params.lng) {
            const coords: [number, number] = [parseFloat(params.lng), parseFloat(params.lat)];
            setUserLocation(coords);
            updateFilters({
              category: params.category || undefined,
              query: params.query || params.category || '',
              transport: (params.transport as any) || 'walking',
              distance: parseInt(params.distance || '5'),
              aroundMeCount: parseInt(params.count || '10')
            });
            
            if (params.autoSearch === 'true' && params.query) {
              setTimeout(() => performSearch(params.query), 1000);
            }
          }
        }
        
        // Initialiser Mapbox
        await initializeMapbox();
        console.log('✅ GeoSearchApp initialisé avec succès');
        
      } catch (error) {
        console.error('❌ Erreur d\'initialisation GeoSearchApp:', error);
        setInitError(error instanceof Error ? error.message : 'Erreur d\'initialisation');
      }
    };

    initializeApp();
  }, []);

  // Auto-search quand position disponible
  useEffect(() => {
    if (userLocation && isMapboxReady && !results.length && !isLoading) {
      console.log('🔍 Auto-recherche de restaurants...');
      performSearch('restaurant');
    }
  }, [userLocation, isMapboxReady]);

  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }): void => {
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
          console.log('📍 Position mise à jour:', coords);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }
  };

  // Gestion des erreurs d'initialisation
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur d'initialisation</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  // Configuration du token Mapbox
  if (showTokenSetup) {
    return <MapboxTokenSetup onTokenValidated={() => setShowTokenSetup(false)} />;
  }

  // Chargement initial
  if (!isMapboxReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <RouteBackButton 
            route="/categories"
            showLabel={true}
            variant="ghost"
          />
          <Logo size="sm" variant="primary" showText={true} />
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          {mapboxError ? (
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {mapboxError}
                <button 
                  onClick={() => setShowTokenSetup(true)}
                  className="ml-2 underline text-blue-600 hover:text-blue-800"
                >
                  Configurer le token
                </button>
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
      </div>
    );
  }

  // Interface principale
  return (
    <GoogleMapsLayout
      filters={filters}
      results={results}
      userLocation={userLocation}
      isLoading={isLoading}
      onSearch={handleSearch}
      onLocationSelect={handleLocationSelect}
      onMyLocationClick={handleMyLocationClick}
      onFiltersChange={updateFilters}
      onResetFilters={resetFilters}
      onBack={() => navigate('/categories')}
    />
  );
};

export default GeoSearchApp;