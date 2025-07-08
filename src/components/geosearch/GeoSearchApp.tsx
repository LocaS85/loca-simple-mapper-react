
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useIsMobile } from '@/hooks/use-mobile';
import MaximizedGeoSearchLayout from './ui/MaximizedGeoSearchLayout';
import MapboxTokenSetup from './ui/MapboxTokenSetup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { mapboxConfigService } from '@/services/mapboxConfigService';

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
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  
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

  // Initialisation sécurisée et paramètres URL
  useEffect(() => {
    console.log('🚀 Initialisation de l\'application GeoSearch');
    
    const initializeApp = async () => {
      try {
        // Vérifier d'abord si un token est disponible
        try {
          await mapboxConfigService.getMapboxToken();
        } catch (error) {
          console.log('⚠️ Token Mapbox manquant, affichage du setup');
          setShowTokenSetup(true);
          return;
        }

        // Initialiser les filtres depuis les paramètres URL
        const urlParams = new URLSearchParams(window.location.search);
        const params: Record<string, string> = {};
        urlParams.forEach((value, key) => {
          params[key] = value;
        });
        
        if (Object.keys(params).length > 0) {
          // Traitement spécial pour les coordonnées depuis les catégories
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
            
            // Auto-recherche si demandée
            if (params.autoSearch === 'true' && params.query) {
              setTimeout(() => performSearch(params.query), 1000);
            }
          }
        }
        
        // Initialiser Mapbox
        await initializeMapbox();
        
      } catch (error) {
        console.error('❌ Erreur initialisation app:', error);
        setShowTokenSetup(true);
      }
    };

    initializeApp();
  }, []);

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

  // Affichage du setup token si nécessaire
  if (showTokenSetup) {
    return <MapboxTokenSetup onTokenValidated={() => setShowTokenSetup(false)} />;
  }

  // Affichage d'erreur si Mapbox non prêt
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
