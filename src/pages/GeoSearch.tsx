
import React, { useEffect } from 'react';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { AlertCircle, CheckCircle } from 'lucide-react';

const GeoSearch = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isInitialized } = useAppInitialization();

  // Utiliser le hook de géolocalisation personnalisé
  const { 
    coordinates: geoCoordinates, 
    isLoading: geoLoading, 
    error: geoError,
    requestLocation 
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
    autoRequest: true
  });

  // Utiliser le store GeoSearch avec API connectée
  const {
    results: searchResults,
    filters,
    isLoading,
    showFilters,
    userLocation,
    isMapboxReady,
    mapboxError,
    updateFilters,
    loadResults,
    toggleFilters,
    setUserLocation,
    setShowFilters,
    initializeMapbox
  } = useGeoSearchStore();

  // Initialiser Mapbox au montage du composant
  useEffect(() => {
    const initMapbox = async () => {
      console.log('🚀 Initialisation de l\'API Mapbox...');
      await initializeMapbox();
    };
    
    initMapbox();
  }, [initializeMapbox]);

  // Afficher le statut de l'API Mapbox
  useEffect(() => {
    if (isMapboxReady) {
      toast({
        title: "API Mapbox connectée",
        description: "La recherche géolocalisée est maintenant disponible",
        variant: "default",
        duration: 3000,
      });
    } else if (mapboxError) {
      toast({
        title: "Erreur API Mapbox",
        description: mapboxError,
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [isMapboxReady, mapboxError, toast]);

  // Synchroniser la géolocalisation avec le store
  useEffect(() => {
    if (geoCoordinates && !userLocation) {
      setUserLocation(geoCoordinates);
      console.log('📍 Géolocalisation synchronisée avec le store:', geoCoordinates);
    }
  }, [geoCoordinates, userLocation, setUserLocation]);

  // Gérer les erreurs de géolocalisation
  useEffect(() => {
    if (geoError && !userLocation) {
      console.warn('⚠️ Erreur de géolocalisation, utilisation de Paris par défaut:', geoError);
      // Position par défaut (Paris)
      setUserLocation([2.3522, 48.8566]);
      
      toast({
        title: t("geosearch.locationError"),
        description: t("geosearch.usingDefaultLocation"),
        variant: "default",
      });
    }
  }, [geoError, userLocation, setUserLocation, toast, t]);

  // Démarrer une recherche automatique quand tout est prêt
  useEffect(() => {
    if (isMapboxReady && userLocation && !searchResults.length && !isLoading) {
      console.log('🔍 Démarrage de la recherche automatique...');
      loadResults();
    }
  }, [isMapboxReady, userLocation, searchResults.length, isLoading, loadResults]);

  // Gérer la sélection de localisation depuis l'auto-suggestion
  const handleLocationSelect = (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    console.log('📍 Location selected in GeoSearch:', location);
    
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name });
    
    toast({
      title: t("geosearch.locationSelected"),
      description: t("geosearch.searchingAround", { 
        place: location.placeName || location.name 
      }),
    });
  };

  // Demander la localisation utilisateur
  const handleUserLocationRequest = () => {
    console.log('🌍 User location request initiated from GeoSearch');
    requestLocation();
  };

  // Réinitialiser les filtres
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
      title: t("filters.reset"),
      description: t("filters.resetSuccess"),
    });
  };

  // Méthode de recherche manuelle
  const handlePerformSearch = async () => {
    if (userLocation && isMapboxReady) {
      try {
        await loadResults();
      } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        toast({
          title: t("geosearch.searchError"),
          description: t("geosearch.searchErrorDesc"),
          variant: "destructive",
        });
      }
    } else if (!isMapboxReady) {
      toast({
        title: "API non prête",
        description: "Veuillez attendre que l'API Mapbox soit initialisée",
        variant: "destructive",
      });
    }
  };

  // Déterminer l'état vide
  const showEmptyState = !isLoading && 
    !geoLoading &&
    searchResults.length === 0 && 
    isInitialized &&
    (filters.category || filters.subcategory || filters.query) &&
    userLocation &&
    isMapboxReady;

  // Métadonnées SEO dynamiques
  const seoTitle = filters.category 
    ? `${filters.category} - ${t('geosearch.title')} | LocaSimple`
    : `${t('geosearch.title')} | LocaSimple`;
    
  const seoDescription = filters.category
    ? t('geosearch.seoDescWithCategory', { category: filters.category })
    : t('geosearch.seoDesc');

  console.log('🎯 GeoSearch render - userLocation:', userLocation, 'searchResults:', searchResults.length, 'mapboxReady:', isMapboxReady);

  // Afficher un message d'erreur si l'API n'est pas prête
  if (!isMapboxReady && !mapboxError && isInitialized) {
    return (
      <>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={`${filters.category || 'lieux'}, géolocalisation, france, carte interactive, recherche locale`}
        />
        
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-10 text-center max-w-md mx-4">
            <div className="mb-6 text-blue-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Connexion à l'API Mapbox...
            </h3>
            <p className="text-gray-600">
              Initialisation de la recherche géolocalisée en cours.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Afficher un message d'erreur critique si l'API a échoué
  if (mapboxError && !isMapboxReady) {
    return (
      <>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={`${filters.category || 'lieux'}, géolocalisation, france, carte interactive, recherche locale`}
        />
        
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-10 text-center max-w-md mx-4">
            <div className="mb-6 text-red-500">
              <AlertCircle size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Erreur de connexion API
            </h3>
            <p className="text-gray-600 mb-6">
              {mapboxError}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => initializeMapbox()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
              >
                Réessayer la connexion
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full justify-center"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`${filters.category || 'lieux'}, géolocalisation, france, carte interactive, recherche locale`}
      />
      
      <div className="relative h-screen w-full overflow-hidden">
        <SearchHeader
          filters={filters}
          onToggleFilters={toggleFilters}
          onLocationSelect={handleLocationSelect}
          onRequestUserLocation={handleUserLocationRequest}
        />
        
        <MapView transport={filters.transport} />
        
        <FiltersPopup
          filters={filters}
          onChange={updateFilters}
          onClose={() => setShowFilters(false)}
          open={showFilters}
          onReset={handleResetFilters}
        />
        
        {/* Indicateur de statut API Mapbox */}
        {isMapboxReady && (
          <div className="absolute top-24 right-4 z-20 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            <span>API connectée</span>
          </div>
        )}
        
        {/* Indicateur de chargement géolocalisation */}
        {geoLoading && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">{t("geosearch.detectingLocation")}</span>
            </div>
          </div>
        )}
        
        {/* État vide amélioré */}
        {showEmptyState && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-10 text-center max-w-md mx-4">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("geosearch.noResults")}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t("geosearch.tryModifyingSearch")}
            </p>
            <div className="mt-4 space-y-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full"
                onClick={toggleFilters}
              >
                {t("geosearch.modifyFilters")}
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 w-full"
                onClick={handlePerformSearch}
              >
                {t("common.retry")}
              </button>
            </div>
          </div>
        )}
        
        {/* Contrôles en position fixe */}
        <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2 sm:flex-row">
          <PrintButton results={searchResults} />
        </div>
        
        <MultiMapToggle />
      </div>
    </>
  );
};

export default GeoSearch;
