
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';
import { SearchPlace, unifiedSearchService } from '@/services/unifiedApiService';

interface UnifiedStoreState {
  // État des filtres
  filters: UnifiedFilters;
  
  // Position et localisation
  userLocation: [number, number] | null;
  
  // Résultats et état de chargement
  results: SearchPlace[];
  isLoading: boolean;
  
  // Interface utilisateur
  showFilters: boolean;
  
  // Actions
  setFilters: (filters: Partial<UnifiedFilters>) => void;
  resetFilters: () => void;
  setUserLocation: (location: [number, number] | null) => void;
  setResults: (results: SearchPlace[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFilters: () => void;
  
  // Action de recherche unifiée
  performSearch: () => Promise<void>;
}

const defaultFilters: UnifiedFilters = {
  category: null,
  subcategory: null,
  transport: 'walking',
  distance: 10,
  unit: 'km',
  query: '',
  aroundMeCount: 3,
  showMultiDirections: false,
  maxDuration: 20
};

export const useUnifiedStore = create<UnifiedStoreState>()(
  devtools(
    (set, get) => ({
      // État initial
      filters: { ...defaultFilters },
      userLocation: null,
      results: [],
      isLoading: false,
      showFilters: false,
      
      // Actions pour les filtres
      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters }
          }),
          false,
          'setFilters'
        ),
        
      resetFilters: () =>
        set({ filters: { ...defaultFilters } }, false, 'resetFilters'),
      
      // Actions pour la position
      setUserLocation: (location) => 
        set({ userLocation: location }, false, 'setUserLocation'),
      
      // Actions pour les résultats
      setResults: (results) => 
        set({ results }, false, 'setResults'),
        
      setIsLoading: (loading) => 
        set({ isLoading: loading }, false, 'setIsLoading'),
      
      // Actions pour l'interface
      toggleFilters: () =>
        set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
      
      // Action de recherche unifiée
      performSearch: async () => {
        const { userLocation, filters, setIsLoading, setResults } = get();
        
        if (!userLocation) {
          console.log('Aucune localisation utilisateur disponible');
          return;
        }
        
        setIsLoading(true);
        console.log('Recherche avec filtres unifiés:', filters);
        
        try {
          const searchParams = {
            ...filters,
            center: userLocation
          };
          
          const results = await unifiedSearchService.searchPlaces(searchParams);
          console.log('Résultats de recherche unifiée:', results);
          
          setResults(results);
          
        } catch (error) {
          console.error('Erreur lors de la recherche unifiée:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'unified-store',
    }
  )
);
