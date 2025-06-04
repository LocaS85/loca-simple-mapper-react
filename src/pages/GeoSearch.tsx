
import React, { useEffect } from 'react';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { AlertCircle, Loader2 } from 'lucide-react';

const GeoSearch: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isInitialized, isMapboxReady } = useAppInitialization();

  const { 
    coordinates: geoCoordinates, 
    isLoading: geoLoading, 
    error: geoError
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000,
    autoRequest: false // Ne pas auto-déclencher, géré par le bouton
  });

  const {
    results: searchResults,
    filters,
    isLoading,
    showFilters,
    userLocation,
    mapboxError,
    networkStatus,
    updateFilters,
    loadResults,
    performSearch,
    toggleFilters,
    setUserLocation,
    setShowFilters,
    initializeMapbox
  } = useGeoSearchStore();

  const [showTokenWarning, setShowTokenWarning] = React.useState(false);

  // Vérifier le token Mapbox
  React.useEffect(() => {
    if (!isMapboxTokenValid()) {
      setShowTokenWarning(true);
    }
  }, []);

  // Synchroniser la géolocalisation uniquement si détectée
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      console.log('📍 Position détectée et appliquée:', geoCoordinates);
      setUserLocation(geoCoordinates);
      
      toast({
        title: "Position détectée",
        description: "Votre localisation a été mise à jour",
        variant: "default",
      });
    }
  }, [geoCoordinates, userLocation, setUserLocation, toast]);

  // Gérer les erreurs de géolocalisation avec message personnalisé
  useEffect(() => {
    if (geoError) {
      console.warn('⚠️ Erreur de géolocalisation:', geoError);
      
      // Si aucune position utilisateur, utiliser Paris par défaut
      if (!userLocation) {
        setUserLocation([2.3522, 48.8566]);
        toast({
          title: "Position par défaut",
          description: "Utilisation de Paris comme position de référence",
          variant: "default",
        });
      }
    }
  }, [geoError, userLocation, setUserLocation, toast]);

  // Déclencher une recherche automatique après initialisation
  useEffect(() => {
    if (isMapboxReady && userLocation && !searchResults.length && !isLoading) {
      console.log('🔍 Démarrage de la recherche automatique');
      setTimeout(() => {
        loadResults();
      }, 1000);
    }
  }, [isMapboxReady, userLocation, searchResults.length, isLoading, loadResults]);

  const handleLocationSelect = (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    console.log('📍 Nouvelle localisation sélectionnée:', location);
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name });
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName || location.name}`,
      variant: "default",
    });
    
    // Déclencher une nouvelle recherche
    setTimeout(() => {
      loadResults();
    }, 300);
  };

  const handleMyLocationClick = async () => {
    console.log('📍 Demande de géolocalisation manuelle');
    
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
      setUserLocation(coords);
      
      toast({
        title: "Position mise à jour",
        description: "Votre localisation a été détectée",
        variant: "default",
      });
      
      // Déclencher une nouvelle recherche
      setTimeout(() => {
        loadResults();
      }, 500);
      
    } catch (error) {
      console.error('❌ Erreur de géolocalisation manuelle:', error);
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position",
        variant: "destructive",
      });
    }
  };

  const handleResetFilters = () => {
    updateFilters({
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
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été remis à zéro",
      variant: "default",
    });
  };

  const handleSearch = async (query?: string) => {
    try {
      await performSearch(query);
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
    }
  };

  const seoTitle = filters.category 
    ? `${filters.category} - ${t('geosearch.title')} | LocaSimple`
    : `${t('geosearch.title')} | LocaSimple`;
    
  const seoDescription = filters.category
    ? t('geosearch.seoDescWithCategory', { category: filters.category })
    : t('geosearch.seoDesc');

  // Afficher l'avertissement du token
  if (showTokenWarning) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <MapboxTokenWarning onTokenUpdate={() => setShowTokenWarning(false)} />
      </>
    );
  }

  // Afficher l'erreur Mapbox
  if (!isMapboxReady && mapboxError) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-xl z-10 text-center max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Erreur de connexion API
            </h3>
            <p className="text-gray-600 mb-6">{mapboxError}</p>
            <button
              onClick={() => initializeMapbox()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} />
      
      <div className="relative h-screen w-full overflow-hidden">
        <SearchHeader
          filters={filters}
          onToggleFilters={toggleFilters}
          onLocationSelect={handleLocationSelect}
          onSearch={handleSearch}
          onMyLocationClick={handleMyLocationClick}
        />
        
        <MapView transport={filters.transport} />
        
        <FiltersPopup
          filters={filters}
          onChange={updateFilters}
          onClose={() => setShowFilters(false)}
          open={showFilters}
          onReset={handleResetFilters}
        />
        
        {/* Indicateur de géolocalisation en cours */}
        {geoLoading && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-30 border border-blue-200">
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Détection de votre position...</span>
            </div>
          </div>
        )}
        
        <div className="fixed bottom-4 right-4 z-10">
          <MultiMapToggle />
        </div>
        
        <PrintButton results={searchResults} />
      </div>
    </>
  );
};

export default GeoSearch;
