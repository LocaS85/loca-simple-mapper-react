
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import { useGeoSearch } from '@/hooks/use-geo-search';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const GeoSearch = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Extract filters from URL
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const transport = searchParams.get('transport') || 'car';
  const distance = Number(searchParams.get('distance')) || 10;
  const unit = searchParams.get('unit') || 'km';
  const query = searchParams.get('query') || '';
  const aroundMeCount = Number(searchParams.get('aroundMeCount')) || 3;
  const showMultiDirections = searchParams.get('showMultiDirections') === 'true';

  const {
    results,
    loadResults,
    filters,
    updateFilters,
    isLoading,
    showFilters,
    toggleFilters,
    setUserLocation,
    userLocation
  } = useGeoSearch({ 
    category, 
    subcategory, 
    transport, 
    distance, 
    unit,
    query,
    aroundMeCount,
    showMultiDirections
  });

  // Initial load of results when component mounts or URL params change
  useEffect(() => {
    console.log('GeoSearch useEffect triggered');
    if (userLocation) {
      console.log('Loading results because userLocation is available');
      loadResults();
    }
  }, [userLocation, loadResults]);

  // Handle location selection from auto-suggestion
  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    console.log('Location selected in GeoSearch:', location);
    // Update user location with selected place coordinates
    setUserLocation(location.coordinates);
    
    // Update filters with place name
    updateFilters({ query: location.name });
    
    toast({
      title: t("geosearch.locationSelected"),
      description: t("geosearch.searchingAround", { place: location.placeName || location.name }),
    });
    
    // Load results for this new location
    loadResults();
  };

  // Handle user location request
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

  // Determine if we need to show an empty state
  const showEmptyState = !isLoading && results.length === 0 && (filters.category || filters.subcategory || filters.query);

  console.log('GeoSearch render - results:', results);
  console.log('GeoSearch render - filters:', filters);
  console.log('GeoSearch render - userLocation:', userLocation);
  console.log('GeoSearch render - showEmptyState:', showEmptyState);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <SearchHeader
        filters={filters}
        onToggleFilters={toggleFilters}
        onLocationSelect={handleLocationSelect}
        onRequestUserLocation={handleUserLocationRequest}
      />
      
      <MapView 
        results={results} 
        isLoading={isLoading} 
        transport={filters.transport} 
      />
      
      {showFilters && (
        <FiltersPopup
          filters={filters}
          onChange={updateFilters}
          onClose={toggleFilters}
        />
      )}
      
      {/* Empty state when no results are found */}
      {showEmptyState && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-10 text-center max-w-md">
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
      
      <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2 sm:flex-row">
        <MultiMapToggle />
        <PrintButton results={results} />
      </div>
    </div>
  );
};

export default GeoSearch;
