
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapView from '@/components/geosearch/MapView';
import FiltersPopup from '@/components/geosearch/FiltersPopup';
import SearchHeader from '@/components/geosearch/SearchHeader';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import { useGeoSearch } from '@/hooks/use-geo-search';
import { useToast } from '@/hooks/use-toast';

const GeoSearch = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Extract filters from URL
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const transport = searchParams.get('transport') || 'car';
  const distance = Number(searchParams.get('distance')) || 10;
  const unit = searchParams.get('unit') || 'km';
  const query = searchParams.get('query') || '';

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
    query
  });

  // Initial load of results when component mounts or URL params change
  useEffect(() => {
    if (category || subcategory || query) {
      loadResults();
    }
  }, [category, subcategory, transport, distance, unit, query, loadResults]);

  // Gérer la sélection d'un lieu depuis l'autosuggestion
  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    // Mettre à jour l'emplacement de l'utilisateur avec les coordonnées du lieu sélectionné
    setUserLocation(location.coordinates);
    
    // Mettre à jour les filtres avec le nom du lieu
    updateFilters({ query: location.name });
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName || location.name}`,
    });
    
    // Charger les résultats pour ce nouvel emplacement
    loadResults();
  };

  // Determine if we need to show an empty state
  const showEmptyState = !isLoading && results.length === 0 && (filters.category || filters.subcategory || filters.query);

  return (
    <div className="relative h-screen w-full">
      <SearchHeader
        filters={filters}
        onToggleFilters={toggleFilters}
        onSearch={(query) => updateFilters({ query })}
        onLocationSelect={handleLocationSelect}
      />
      
      <MapView 
        results={results} 
        isLoading={isLoading} 
        transport={transport as any} 
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
          <h3 className="text-lg font-medium text-gray-900">Aucun résultat trouvé</h3>
          <p className="mt-2 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou changez de lieu pour trouver plus de résultats.
          </p>
          <div className="mt-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={toggleFilters}
            >
              Modifier les filtres
            </button>
          </div>
        </div>
      )}
      
      <MultiMapToggle />
      <PrintButton results={results} />
    </div>
  );
};

export default GeoSearch;
