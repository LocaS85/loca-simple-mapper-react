
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';

const GeoSearch = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Utiliser le store Zustand
  const {
    results,
    filters,
    isLoading,
    showFilters,
    userLocation,
    setUserLocation,
    updateFilters,
    loadResults,
    toggleFilters,
    resetFilters
  } = useGeoSearchStore();

  // Extraire les filtres depuis l'URL
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const transport = searchParams.get('transport') || 'car';
    const distance = Number(searchParams.get('distance')) || 10;
    const unit = searchParams.get('unit') || 'km';
    const query = searchParams.get('query') || '';
    const aroundMeCount = Number(searchParams.get('aroundMeCount')) || 3;
    const showMultiDirections = searchParams.get('showMultiDirections') === 'true';

    // Mettre à jour les filtres depuis l'URL
    updateFilters({
      category,
      subcategory,
      transport: transport as any,
      distance,
      unit: unit as any,
      query,
      aroundMeCount,
      showMultiDirections
    });
  }, [searchParams, updateFilters]);

  // Chargement initial des résultats quand le composant se monte ou que les paramètres URL changent
  useEffect(() => {
    console.log('GeoSearch useEffect triggered');
    if (userLocation) {
      console.log('Loading results because userLocation is available');
      loadResults();
    }
  }, [userLocation, loadResults]);

  // Gérer la sélection de localisation depuis l'auto-suggestion
  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    console.log('Location selected in GeoSearch:', location);
    // Mettre à jour la localisation utilisateur avec les coordonnées du lieu sélectionné
    setUserLocation(location.coordinates);
    
    // Mettre à jour les filtres avec le nom du lieu
    updateFilters({ query: location.name });
    
    toast({
      title: t("geosearch.locationSelected"),
      description: t("geosearch.searchingAround", { place: location.placeName || location.name }),
    });
    
    // Charger les résultats pour cette nouvelle localisation
    loadResults();
  };

  // Gérer la demande de localisation utilisateur
  const handleUserLocationRequest = () => {
    console.log('Requesting user location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: [number, number] = [position.coords.longitude, position.coords.latitude];
          console.log('User location retrieved:', coordinates);
          setUserLocation(coordinates);
          
          toast({
            title: t("map.yourLocation"),
            description: t("geosearch.usingCurrentLocation"),
          });
          
          loadResults();
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: t("geosearch.locationError"),
            description: t("geosearch.locationErrorDesc"),
            variant: "destructive",
          });
        }
      );
    }
  };

  // Forcer la demande de localisation initiale si aucune localisation n'est définie
  useEffect(() => {
    if (!userLocation) {
      handleUserLocationRequest();
    }
  }, [userLocation]);

  // Déterminer si nous devons afficher un état vide
  const showEmptyState = !isLoading && results.length === 0 && (filters.category || filters.subcategory || filters.query);

  return (
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
        onReset={resetFilters}
      />
      
      {/* État vide quand aucun résultat n'est trouvé */}
      {showEmptyState && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-10 text-center max-w-md mx-4">
          <div className="mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t("geosearch.noResults")}</h3>
          <p className="mt-2 text-sm text-gray-500">
            {t("geosearch.tryModifyingSearch")}
          </p>
          <div className="mt-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={toggleFilters}
            >
              {t("geosearch.modifyFilters")}
            </button>
          </div>
        </div>
      )}
      
      {/* Contrôles en position fixe */}
      <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2 sm:flex-row">
        <PrintButton results={results} />
      </div>
      
      {/* Ajouter le composant MultiMapToggle */}
      <MultiMapToggle />
    </div>
  );
};

export default GeoSearch;
