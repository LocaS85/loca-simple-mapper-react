
import { useCallback } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface SearchSelectResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties: Record<string, unknown>;
}

interface SearchIntegrationContextType {
  onSearchSelect: (result: SearchSelectResult) => void;
  onDirectSearch: (query: string) => void;
}

export const useSearchIntegrationContext = (): SearchIntegrationContextType => {
  const { updateFilters, performSearch, setUserLocation } = useGeoSearchStore();

  const onSearchSelect = useCallback((result: SearchSelectResult) => {
    console.log('🔍 Search result selected:', result);
    
    // Mettre à jour la position utilisateur avec le centre du résultat
    setUserLocation(result.center);
    
    // Mettre à jour les filtres avec la requête de recherche
    updateFilters({ 
      query: result.text
    });
    
    // Déclencher une nouvelle recherche
    performSearch(result.text);
  }, [updateFilters, performSearch, setUserLocation]);

  const onDirectSearch = useCallback((query: string) => {
    console.log('🔍 Direct search:', query);
    
    // Mettre à jour les filtres et déclencher la recherche
    updateFilters({ query });
    performSearch(query);
  }, [updateFilters, performSearch]);

  return {
    onSearchSelect,
    onDirectSearch
  };
};
