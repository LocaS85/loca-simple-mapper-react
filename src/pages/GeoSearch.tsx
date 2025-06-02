
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
import { AlertCircle } from 'lucide-react';

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
    timeout: 10000,
    maximumAge: 300000,
    autoRequest: true
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

  // Vérifier si le token Mapbox est valide
  const [showTokenWarning, setShowTokenWarning] = React.useState(false);

  React.useEffect(() => {
    if (!isMapboxTokenValid()) {
      setShowTokenWarning(true);
    }
  }, []);

  // Synchroniser la géolocalisation
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      console.log('📍 Mise à jour de la position utilisateur:', geoCoordinates);
      setUserLocation(geoCoordinates);
    }
  }, [geoCoordinates, userLocation, setUserLocation]);

  // Gérer les erreurs de géolocalisation
  useEffect(() => {
    if (geoError && !userLocation) {
      console.log('⚠️ Erreur de géolocalisation, utilisation de Paris par défaut');
      setUserLocation([2.3522, 48.8566]); // Paris par défaut
      toast({
        title: t("geosearch.locationError"),
        description: t("geosearch.usingDefaultLocation"),
        variant: "default",
      });
    }
  }, [geoError, userLocation, setUserLocation, toast, t]);

  // Démarrer une recherche automatique
  useEffect(() => {
    if (isMapboxReady && userLocation && !searchResults.length && !isLoading) {
      console.log('🔍 Démarrage de la recherche automatique');
      loadResults();
    }
  }, [isMapboxReady, userLocation, searchResults.length, isLoading, loadResults]);

  const handleLocationSelect = (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name });
    
    toast({
      title: t("geosearch.locationSelected"),
      description: t("geosearch.searchingAround", { 
        place: location.placeName || location.name 
      }),
    });
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

  // Afficher l'avertissement du token si nécessaire
  if (showTokenWarning) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <MapboxTokenWarning onTokenUpdate={() => setShowTokenWarning(false)} />
      </>
    );
  }

  if (!isMapboxReady && mapboxError) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-10 text-center max-w-md mx-4">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Erreur de connexion API
            </h3>
            <p className="text-gray-600 mb-6">{mapboxError}</p>
            <button
              onClick={() => initializeMapbox()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Réessayer
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
        />
        
        <MapView transport={filters.transport} />
        
        <FiltersPopup
          filters={filters}
          onChange={updateFilters}
          onClose={() => setShowFilters(false)}
          open={showFilters}
          onReset={handleResetFilters}
        />
        
        {networkStatus === 'slow' && (
          <div className="absolute top-20 left-4 z-20 bg-yellow-100 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Connexion lente</span>
          </div>
        )}
        
        {networkStatus === 'offline' && (
          <div className="absolute top-20 left-4 z-20 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Mode hors-ligne</span>
          </div>
        )}
        
        {geoLoading && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">{t("geosearch.detectingLocation")}</span>
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
