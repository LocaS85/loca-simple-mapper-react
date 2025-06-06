
import { useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { geoSearchService } from '@/services/geoSearchService';
import { GeoSearchFilters } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';

interface UseGeoSearchActionsProps {
  userLocation: [number, number] | null;
  filters: GeoSearchFilters;
  isMapboxReady: boolean;
  setResults: (results: any[]) => void;
  setIsLoading: (loading: boolean) => void;
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  setUserLocation: (location: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useGeoSearchActions = ({
  userLocation,
  filters,
  isMapboxReady,
  setResults,
  setIsLoading,
  updateFilters,
  setUserLocation,
  searchQuery,
  setSearchQuery
}: UseGeoSearchActionsProps) => {
  const { toast } = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Main search function
  const performSearch = useCallback(async (query?: string) => {
    if (!userLocation || !isMapboxReady) {
      console.log('❌ Conditions non remplies pour la recherche:', { userLocation, isMapboxReady });
      if (!userLocation) {
        toast({
          title: "Position requise",
          description: "Veuillez autoriser la géolocalisation ou sélectionner une position",
          variant: "destructive",
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      let searchResults;
      
      if (query && query.trim()) {
        console.log('🔍 Recherche par requête:', query);
        searchResults = await geoSearchService.searchByQuery(query, userLocation, filters);
      } else {
        console.log('🔍 Recherche à proximité');
        searchResults = await geoSearchService.searchNearby(userLocation, filters);
      }
      
      console.log('✅ Résultats de recherche:', searchResults);
      setResults(searchResults || []);
      
      if (!searchResults || searchResults.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun lieu trouvé pour votre recherche. Essayez d'élargir votre zone de recherche.",
          variant: "default",
        });
      } else {
        toast({
          title: "Recherche terminée",
          description: `${searchResults.length} lieu${searchResults.length > 1 ? 'x' : ''} trouvé${searchResults.length > 1 ? 's' : ''}`,
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche. Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, filters, isMapboxReady, setIsLoading, setResults, toast]);

  // Enhanced filters update
  const updateFiltersWithSearch = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    if (!newFilters || typeof newFilters !== 'object') {
      console.warn('❌ Filtres invalides:', newFilters);
      return;
    }

    console.log('🔄 Mise à jour des filtres:', newFilters);
    updateFilters(newFilters);
    
    // Auto-trigger search for important filter changes
    const criticalFilters = ['category', 'transport', 'distance', 'maxDuration'];
    const shouldAutoSearch = Object.keys(newFilters).some(key => 
      criticalFilters.includes(key)
    );
    
    if (shouldAutoSearch && userLocation && isMapboxReady) {
      console.log('🔄 Auto-recherche déclenchée par changement de filtres');
      setTimeout(() => performSearch(searchQuery), 500);
    }
  }, [updateFilters, userLocation, isMapboxReady, performSearch, searchQuery]);

  // Location selection handler
  const handleLocationSelect = useCallback((location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => {
    if (!location?.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      console.error('❌ Données de lieu invalides:', location);
      toast({
        title: "Erreur de lieu",
        description: "Les données de localisation sont invalides",
        variant: "destructive",
      });
      return;
    }

    console.log('📍 Sélection de lieu:', location);
    setUserLocation(location.coordinates);
    updateFilters({ query: location.name || '' });
    setSearchQuery(location.name || '');
    
    toast({
      title: "Lieu sélectionné",
      description: `Recherche autour de ${location.placeName || location.name}`,
      variant: "default",
    });
    
    setTimeout(() => performSearch(location.name), 800);
  }, [setUserLocation, updateFilters, performSearch, setSearchQuery, toast]);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    if (typeof query !== 'string') {
      console.log('❌ Requête de recherche invalide:', query);
      return;
    }
    console.log('🔍 Déclenchement de recherche:', query);
    setSearchQuery(query);
    
    // Immediate search for non-empty queries
    if (query.trim() && userLocation && isMapboxReady) {
      setTimeout(() => performSearch(query), 300);
    }
  }, [setSearchQuery, userLocation, isMapboxReady, performSearch]);

  // Transport change handler
  const handleTransportChange = useCallback((transport: TransportMode) => {
    updateFiltersWithSearch({ transport });
  }, [updateFiltersWithSearch]);

  return {
    debouncedSearchQuery,
    performSearch,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleTransportChange
  };
};
