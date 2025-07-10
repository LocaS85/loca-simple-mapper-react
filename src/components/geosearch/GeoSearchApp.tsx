import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import GoogleMapsLayout from './GoogleMapsLayout';
import MapboxTokenSetup from './ui/MapboxTokenSetup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { mapboxConfigService } from '@/services/mapboxConfigService';

const GeoSearchApp: React.FC = () => {
  const navigate = useNavigate();
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  
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

  // Initialisation et paramètres URL
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Vérifier token Mapbox
        try {
          await mapboxConfigService.getMapboxToken();
        } catch (error) {
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
              category: params.category || '',
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
        
        await initializeMapbox();
        
      } catch (error) {
        console.error('Erreur initialisation app:', error);
        setShowTokenSetup(true);
      }
    };

    initializeApp();
  }, []);

  // Auto-search quand position disponible
  useEffect(() => {
    if (userLocation && isMapboxReady && !results.length && !isLoading) {
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
    setUserLocation(null);
    
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

  if (showTokenSetup) {
    return <MapboxTokenSetup onTokenValidated={() => setShowTokenSetup(false)} />;
  }

  if (!isMapboxReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
    );
  }

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