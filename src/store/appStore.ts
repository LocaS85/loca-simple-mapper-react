
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { unifiedSearchService } from '@/services/unifiedApiService';
import { filterSyncService } from './filterSync';

interface AppState {
  // Position et localisation
  userLocation: [number, number] | null;
  
  // Filtres de recherche
  filters: GeoSearchFilters;
  
  // Résultats et état
  searchResults: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  
  // Actions pour la position
  setUserLocation: (location: [number, number] | null) => void;
  
  // Actions pour les filtres
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  
  // Actions pour les résultats
  setSearchResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Actions pour l'interface
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  
  // Actions de recherche
  performSearch: (forceRefresh?: boolean) => Promise<void>;
}

const defaultFilters: GeoSearchFilters = {
  category: null,
  subcategory: null,
  transport: 'walking' as TransportMode,
  distance: 10,
  unit: 'km' as 'km' | 'mi',
  query: '',
  aroundMeCount: 3,
  showMultiDirections: false,
  maxDuration: 20
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // État initial
      userLocation: null,
      filters: { ...defaultFilters },
      searchResults: [],
      isLoading: false,
      showFilters: false,
      
      // Actions pour la position
      setUserLocation: (location) => {
        console.log('Setting user location in store:', location);
        set({ userLocation: location }, false, 'setUserLocation');
        
        // Déclencher une nouvelle recherche si on a une localisation
        if (location) {
          setTimeout(() => {
            get().performSearch(true);
          }, 500);
        }
      },
      
      // Actions pour les filtres
      updateFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        
        console.log('Updating filters:', newFilters);
        set({ filters: updatedFilters }, false, 'updateFilters');
        
        // Déclencher une recherche si on a une localisation et des filtres critiques ont changé
        const criticalFilters = ['category', 'subcategory', 'transport', 'distance', 'maxDuration', 'aroundMeCount', 'query'];
        const shouldRefresh = Object.keys(newFilters).some(key => criticalFilters.includes(key));
        
        if (shouldRefresh && get().userLocation) {
          setTimeout(() => {
            get().performSearch(true);
          }, 300);
        }
      },
        
      resetFilters: () => {
        console.log('Resetting filters to default');
        set({ filters: { ...defaultFilters } }, false, 'resetFilters');
      },
      
      // Actions pour les résultats
      setSearchResults: (results) => {
        console.log('Setting search results:', results);
        set({ searchResults: results }, false, 'setSearchResults');
      },
        
      setIsLoading: (loading) => 
        set({ isLoading: loading }, false, 'setIsLoading'),
      
      // Actions pour l'interface
      toggleFilters: () =>
        set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
        
      setShowFilters: (show) => 
        set({ showFilters: show }, false, 'setShowFilters'),
      
      // Action de recherche principale
      performSearch: async (forceRefresh = false) => {
        const { userLocation, filters, setIsLoading, setSearchResults } = get();
        
        if (!userLocation) {
          console.log('Aucune localisation utilisateur pour la recherche');
          return;
        }
        
        console.log('Performing search with filters:', filters);
        setIsLoading(true);
        
        try {
          // Convertir les filtres pour l'API unifiée
          const unifiedFilters = filterSyncService.geoSearchToUnified(filters);
          const searchParams = {
            ...unifiedFilters,
            center: userLocation
          };

          console.log('API search params:', searchParams);
          const places = await unifiedSearchService.searchPlaces(searchParams);
          
          // Convertir les résultats
          const searchResults = places.map(place => ({
            id: place.id,
            name: place.name,
            address: place.address,
            coordinates: place.coordinates,
            type: place.category,
            category: place.category,
            distance: place.distance,
            duration: place.duration || 0
          }));
          
          console.log('Search results converted:', searchResults);
          setSearchResults(searchResults);
          
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          
          // Fallback avec données mockées si erreur réseau
          if (error instanceof Error && error.message.includes('network')) {
            const mockResults: SearchResult[] = Array.from({ length: filters.aroundMeCount }, (_, i) => ({
              id: `mock-result-${i}`,
              name: `${filters.category || 'Lieu'} ${i + 1}`,
              address: `${123 + i} Rue d'Exemple, France`,
              coordinates: [
                userLocation[0] + (Math.random() * 0.02 - 0.01),
                userLocation[1] + (Math.random() * 0.02 - 0.01)
              ] as [number, number],
              type: filters.subcategory || 'default',
              category: filters.category || 'default',
              distance: Math.round(Math.random() * filters.distance * 10) / 10,
              duration: Math.round(Math.random() * 30)
            }));
            
            setSearchResults(mockResults);
          } else {
            setSearchResults([]);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'app-store',
    }
  )
);
