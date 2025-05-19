
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

  const {
    results,
    loadResults,
    filters,
    updateFilters,
    isLoading,
    showFilters,
    toggleFilters,
    setUserLocation
  } = useGeoSearch({ category, subcategory, transport, distance, unit });

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // Gérer la sélection d'un lieu depuis l'autosuggestion
  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    // Mettre à jour l'emplacement de l'utilisateur avec les coordonnées du lieu sélectionné
    setUserLocation(location.coordinates);
    
    // Mettre à jour les filtres avec le nom du lieu
    updateFilters({ query: location.name });
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.name}`,
    });
    
    // Charger les résultats pour ce nouvel emplacement
    loadResults();
  };

  return (
    <div className="relative h-screen w-full">
      <SearchHeader
        filters={filters}
        onToggleFilters={toggleFilters}
        onSearch={(query) => updateFilters({ query })}
        onLocationSelect={handleLocationSelect}
      />
      <MapView results={results} isLoading={isLoading} transport={transport as any} />
      {showFilters && (
        <FiltersPopup
          filters={filters}
          onChange={updateFilters}
          onClose={toggleFilters}
        />
      )}
      <MultiMapToggle />
      <PrintButton results={results} />
    </div>
  );
};

export default GeoSearch;
