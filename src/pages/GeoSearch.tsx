
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
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { AlertCircle } from 'lucide-react';

const GeoSearch = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isInitialized } = useAppInitialization();
  const [tokenValid, setTokenValid] = React.useState(true);

  // Utiliser uniquement le store GeoSearch pour la cohérence
  const {
    results: searchResults,
    filters,
    isLoading,
    showFilters,
    userLocation,
    updateFilters,
    performSearch,
    toggleFilters,
    setUserLocation,
    setShowFilters
  } = useGeoSearchStore();

  // Vérifier le token Mapbox au montage
  useEffect(() => {
    const checkToken = () => {
      const valid = isMapboxTokenValid();
      setTokenValid(valid);
      
      if (!valid) {
        toast({
          title: "Configuration Mapbox requise",
          description: "Veuillez configurer un token Mapbox valide pour utiliser la recherche",
          variant: "destructive",
          duration: 8000,
        });
      }
    };
    
    checkToken();
  }, [toast]);

  // Gérer la sélection de localisation depuis l'auto-suggestion
  const handleLocationSelect = (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    console.log('Location selected in GeoSearch:', location);
    
    // Mettre à jour la localisation utilisateur
    setUserLocation(location.coordinates);
    
    // Mettre à jour la requête dans les filtres
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
    console.log('User location request initiated from GeoSearch');
    // La logique est maintenant dans SearchHeader
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

  // Déterminer l'état vide
  const showEmptyState = !isLoading && 
    searchResults.length === 0 && 
    isInitialized &&
    (filters.category || filters.subcategory || filters.query) &&
    userLocation &&
    tokenValid;

  // Métadonnées SEO dynamiques
  const seoTitle = filters.category 
    ? `${filters.category} - ${t('geosearch.title')} | LocaSimple`
    : `${t('geosearch.title')} | LocaSimple`;
    
  const seoDescription = filters.category
    ? t('geosearch.seoDescWithCategory', { category: filters.category })
    : t('geosearch.seoDesc');

  console.log('GeoSearch render - userLocation:', userLocation, 'searchResults:', searchResults.length, 'tokenValid:', tokenValid);

  // Afficher un message d'erreur si le token n'est pas valide
  if (!tokenValid) {
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
              Configuration Mapbox requise
            </h3>
            <p className="text-gray-600 mb-6">
              Pour utiliser la recherche géographique, vous devez configurer un token Mapbox valide. 
              Utilisez la barre de recherche en haut de page pour entrer votre token.
            </p>
            <div className="space-y-3">
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
              >
                Obtenir un token Mapbox
              </a>
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
                onClick={() => performSearch(true)}
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
