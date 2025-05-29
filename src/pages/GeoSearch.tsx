
import React, { useEffect } from 'react';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/appStore';
import { useAppInitialization } from '@/hooks/useAppInitialization';

const GeoSearch = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isInitialized } = useAppInitialization();

  // État de l'application centralisé
  const {
    searchResults,
    filters,
    isLoading,
    showFilters,
    userLocation,
    updateFilters,
    performSearch,
    toggleFilters,
    setUserLocation
  } = useAppStore();

  // Gérer la sélection de localisation
  const handleLocationSelect = (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => {
    console.log('Location selected:', location);
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [
            position.coords.longitude, 
            position.coords.latitude
          ];
          setUserLocation(coordinates);
          
          toast({
            title: t("map.yourLocation"),
            description: t("geosearch.usingCurrentLocation"),
          });
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          toast({
            title: t("geosearch.locationError"),
            description: t("geosearch.locationErrorDesc"),
            variant: "destructive",
          });
        }
      );
    }
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
  };

  // Déterminer l'état vide
  const showEmptyState = !isLoading && 
    searchResults.length === 0 && 
    isInitialized &&
    (filters.category || filters.subcategory || filters.query);

  // Métadonnées SEO dynamiques
  const seoTitle = filters.category 
    ? `${filters.category} - Recherche géolocalisée | LocaSimple`
    : "Recherche géolocalisée | LocaSimple";
    
  const seoDescription = filters.category
    ? `Trouvez les meilleurs ${filters.category} près de chez vous avec LocaSimple. Recherche avancée, filtres intelligents et cartes interactives.`
    : "Découvrez facilement les lieux autour de vous avec LocaSimple. Application de cartographie française avec recherche avancée et filtres intelligents.";

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
          onClose={toggleFilters}
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
