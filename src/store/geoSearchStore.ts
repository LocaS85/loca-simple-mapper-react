
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { unifiedSearchService, SearchPlace } from '@/services/unifiedApiService';
import { filterSyncService } from './filterSync';
import { performanceService } from '@/services/performanceService';

interface GeoSearchState {
  // Position et localisation
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  
  // Filtres de recherche avec synchronisation
  filters: GeoSearchFilters;
  
  // Résultats et état avec cache optimisé
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  lastSearchParams: string | null;
  searchCache: Map<string, { results: SearchResult[]; timestamp: number }>;
  
  // Actions pour la position
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  
  // Actions pour les filtres avec validation améliorée
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  
  // Actions pour les résultats avec performance
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Actions pour l'interface
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  
  // Actions de recherche optimisées
  loadResults: () => Promise<void>;
  clearCache: () => void;
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

// Fonction de conversion optimisée
const convertToSearchResult = (place: SearchPlace): SearchResult => ({
  id: place.id,
  name: place.name,
  address: place.address,
  coordinates: place.coordinates,
  type: place.category,
  category: place.category,
  distance: place.distance,
  duration: place.duration || 0
});

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
      lastSearchParams: null,
      searchCache: new Map(),
      
      // Actions pour la position
      setUserLocation: (location) => {
        set({ userLocation: location }, false, 'setUserLocation');
        if (location) {
          get().clearCache();
        }
      },
        
      setStartingPosition: (position) => 
        set({ startingPosition: position }, false, 'setStartingPosition'),
      
      // Actions pour les filtres avec validation et debouncing
      updateFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        
        if (filterSyncService.validateFilters(updatedFilters)) {
          set({ filters: updatedFilters }, false, 'updateFilters');
          
          const criticalFilters = ['category', 'subcategory', 'transport', 'distance', 'maxDuration', 'aroundMeCount'];
          const shouldRefresh = Object.keys(newFilters).some(key => criticalFilters.includes(key));
            
          if (shouldRefresh && get().userLocation) {
            setTimeout(() => {
              const state = get();
              if (state.userLocation) {
                state.loadResults();
              }
            }, 300);
          }
        } else {
          console.warn('Filtres invalides ignorés:', newFilters);
        }
      },
        
      resetFilters: () => {
        set({ 
          filters: { ...defaultFilters }, 
          lastSearchParams: null 
        }, false, 'resetFilters');
        get().clearCache();
      },
      
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
      
      // Action de recherche optimisée avec cache intelligent
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults, lastSearchParams, searchCache } = get();
        
        if (!userLocation) {
          console.log('Aucune localisation utilisateur disponible pour la recherche');
          return;
        }
        
        // Mesurer les performances - correction de l'appel
        const endSearchTimer = performanceService.startSearchTimer();
        
        const searchKey = JSON.stringify({ userLocation, filters });
        
        // Vérifier le cache (valide pendant 5 minutes)
        const cached = searchCache.get(searchKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < 300000) {
          console.log('Utilisation du cache pour les résultats');
          setResults(cached.results);
          performanceService.incrementCacheHits();
          endSearchTimer();
          return;
        }
        
        if (searchKey === lastSearchParams && !cached) {
          console.log('Recherche identique en cours, ignorée');
          return;
        }
        
        performanceService.incrementCacheMisses();
        setIsLoading(true);
        console.log('Chargement des résultats avec filtres validés:', filters);
        
        try {
          const unifiedFilters = filterSyncService.geoSearchToUnified(filters);
          const searchParams = {
            ...unifiedFilters,
            center: userLocation
          };

          performanceService.incrementApiCalls();
          const places = await unifiedSearchService.searchPlaces(searchParams);
          
          const searchResults = places.map(convertToSearchResult);
          
          console.log('Résultats API convertis:', searchResults);
          setResults(searchResults);
          
          // Mettre à jour le cache
          const newCache = new Map(searchCache);
          newCache.set(searchKey, { results: searchResults, timestamp: now });
          
          if (newCache.size > 50) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          
          set({ 
            lastSearchParams: searchKey,
            searchCache: newCache
          }, false, 'updateSearchCache');
          
        } catch (error) {
          console.error('Erreur lors du chargement des résultats:', error);
          
          if (error instanceof Error && error.message.includes('network')) {
            const mockResults: SearchResult[] = Array.from({ length: filters.aroundMeCount }, (_, i) => ({
              id: `fallback-result-${i}`, 
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
            
            setResults(mockResults);
          } else {
            setResults([]);
          }
        } finally {
          setIsLoading(false);
          endSearchTimer();
          
          if (process.env.NODE_ENV === 'development') {
            console.log(performanceService.analyzePerformance());
          }
        }
      },

      // Gestion du cache
      clearCache: () => {
        set({ searchCache: new Map() }, false, 'clearCache');
        console.log('Cache de recherche vidé');
      }
    }),
    {
      name: 'geo-search-store',
    }
  )
);
