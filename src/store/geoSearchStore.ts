
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';

interface GeoSearchState {
  // Position et localisation
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  
  // Filtres de recherche
  filters: GeoSearchFilters;
  
  // Résultats et état
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  
  // Actions pour la position
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  
  // Actions pour les filtres
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  
  // Actions pour les résultats
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Actions pour l'interface
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  
  // Actions de recherche
  loadResults: () => Promise<void>;
}

const defaultFilters: GeoSearchFilters = {
  category: null,
  subcategory: null,
  transport: 'car' as TransportMode,
  distance: 10,
  unit: 'km' as 'km' | 'mi',
  query: '',
  aroundMeCount: 3,
  showMultiDirections: false,
  maxDuration: 20
};

export const useGeoSearchStore = create<GeoSearchState>()(
  devtools(
    (set, get) => ({
      // État initial
      userLocation: null,
      startingPosition: null,
      filters: { ...defaultFilters },
      results: [],
      isLoading: false,
      showFilters: false,
      
      // Actions pour la position
      setUserLocation: (location) => 
        set({ userLocation: location }, false, 'setUserLocation'),
        
      setStartingPosition: (position) => 
        set({ startingPosition: position }, false, 'setStartingPosition'),
      
      // Actions pour les filtres
      updateFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters }
          }),
          false,
          'updateFilters'
        ),
        
      resetFilters: () =>
        set({ filters: { ...defaultFilters } }, false, 'resetFilters'),
      
      // Actions pour les résultats
      setResults: (results) => 
        set({ results }, false, 'setResults'),
        
      setIsLoading: (loading) => 
        set({ isLoading: loading }, false, 'setIsLoading'),
      
      // Actions pour l'interface
      toggleFilters: () =>
        set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
        
      setShowFilters: (show) => 
        set({ showFilters: show }, false, 'setShowFilters'),
      
      // Action de recherche
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults } = get();
        
        if (!userLocation) {
          console.log('No user location available for search');
          return;
        }
        
        setIsLoading(true);
        console.log('Loading results with filters:', filters);
        console.log('User location:', userLocation);
        
        try {
          // Simuler un délai d'API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Calculer le nombre de résultats basé sur aroundMeCount
          const resultCount = filters.aroundMeCount || 3;
          
          // Données mockées basées sur les filtres
          const mockResults: SearchResult[] = Array.from({ length: resultCount }, (_, i) => ({
            id: `result-${i}`, 
            name: `${filters.category || 'Place'} ${filters.subcategory || 'Popular'} ${i + 1}`, 
            address: `${123 + i} Street Name, ${filters.query || 'Paris'}`,
            coordinates: [
              userLocation[0] + (Math.random() * 0.02 - 0.01), 
              userLocation[1] + (Math.random() * 0.02 - 0.01)
            ] as [number, number], 
            type: filters.subcategory || 'default',
            category: filters.category || 'default', 
            distance: Math.round(Math.random() * filters.distance * 10) / 10, 
            duration: Math.round(Math.random() * 30) 
          }));
          
          // Si une requête de recherche est spécifiée, ajouter un résultat spécifique
          if (filters.query) {
            const searchSpecificResult: SearchResult = { 
              id: 'search-result',
              name: filters.query,
              address: `Near ${filters.query}, Country`,
              coordinates: [userLocation[0] + 0.02, userLocation[1] + 0.02] as [number, number],
              type: 'search-result',
              category: filters.category || 'search',
              distance: Math.round(Math.random() * filters.distance * 10) / 10,
              duration: Math.round(Math.random() * 30)
            };
            
            mockResults.unshift(searchSpecificResult);
          }
          
          console.log('Generated mock results:', mockResults);
          setResults(mockResults.slice(0, resultCount));
          
        } catch (error) {
          console.error('Error loading results:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'geo-search-store',
    }
  )
);
