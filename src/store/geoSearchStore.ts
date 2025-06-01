
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { mapboxApiService } from '@/services/mapboxApiService';
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
  
  // État de l'API Mapbox
  isMapboxReady: boolean;
  mapboxError: string | null;
  
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
  
  // Actions de recherche optimisées avec API connectée
  loadResults: () => Promise<void>;
  initializeMapbox: () => Promise<void>;
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

// Fonction de conversion des résultats Mapbox vers SearchResult
const convertMapboxToSearchResult = (mapboxResult: any, userLocation: [number, number]): SearchResult => {
  // Calculer la distance
  const distance = calculateDistance(userLocation, mapboxResult.coordinates);
  
  return {
    id: mapboxResult.id,
    name: mapboxResult.name,
    address: mapboxResult.address,
    coordinates: mapboxResult.coordinates,
    type: mapboxResult.category,
    category: mapboxResult.category,
    distance: Math.round(distance * 10) / 10,
    duration: Math.round(distance * 12) // Estimation : 12 min/km à pied
  };
};

// Fonction utilitaire pour calculer la distance
const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
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
      lastSearchParams: null,
      searchCache: new Map(),
      isMapboxReady: false,
      mapboxError: null,
      
      // Actions pour la position
      setUserLocation: (location) => {
        set({ userLocation: location }, false, 'setUserLocation');
        if (location) {
          get().clearCache();
        }
      },
        
      setStartingPosition: (position) => 
        set({ startingPosition: position }, false, 'setStartingPosition'),
      
      // Initialisation de Mapbox
      initializeMapbox: async () => {
        try {
          const isReady = await mapboxApiService.initialize();
          set({ 
            isMapboxReady: isReady,
            mapboxError: isReady ? null : 'Impossible d\'initialiser l\'API Mapbox'
          }, false, 'initializeMapbox');
          
          if (isReady) {
            console.log('✅ Mapbox initialisé dans le store');
          }
        } catch (error) {
          console.error('❌ Erreur d\'initialisation Mapbox:', error);
          set({ 
            isMapboxReady: false,
            mapboxError: error instanceof Error ? error.message : 'Erreur inconnue'
          }, false, 'mapboxError');
        }
      },
      
      // Actions pour les filtres
      updateFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        
        if (filterSyncService.validateFilters(updatedFilters)) {
          set({ filters: updatedFilters }, false, 'updateFilters');
          
          const criticalFilters = ['category', 'subcategory', 'transport', 'distance', 'maxDuration', 'aroundMeCount'];
          const shouldRefresh = Object.keys(newFilters).some(key => criticalFilters.includes(key));
            
          if (shouldRefresh && get().userLocation && get().isMapboxReady) {
            setTimeout(() => {
              const state = get();
              if (state.userLocation && state.isMapboxReady) {
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
      
      // Action de recherche avec API Mapbox connectée
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults, lastSearchParams, searchCache, isMapboxReady } = get();
        
        if (!userLocation) {
          console.log('Aucune localisation utilisateur disponible pour la recherche');
          return;
        }

        if (!isMapboxReady) {
          console.log('API Mapbox non prête, tentative d\'initialisation...');
          await get().initializeMapbox();
          if (!get().isMapboxReady) {
            console.error('Impossible d\'initialiser l\'API Mapbox');
            return;
          }
        }
        
        const endSearchTimer = performanceService.startSearchTimer();
        const searchKey = JSON.stringify({ userLocation, filters });
        
        // Vérifier le cache
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
        console.log('🔍 Recherche avec API Mapbox connectée:', filters);
        
        try {
          // Construire la requête de recherche
          let searchQuery = filters.query || '';
          if (filters.category && !searchQuery) {
            searchQuery = filters.category;
          }
          if (filters.subcategory) {
            searchQuery = `${searchQuery} ${filters.subcategory}`.trim();
          }
          if (!searchQuery) {
            searchQuery = 'point of interest';
          }

          performanceService.incrementApiCalls();
          
          // Appel à l'API Mapbox via le service
          const mapboxResults = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
            limit: filters.aroundMeCount,
            radius: filters.distance,
            categories: filters.category ? [filters.category] : undefined
          });
          
          // Convertir les résultats
          const searchResults = mapboxResults.map(result => 
            convertMapboxToSearchResult(result, userLocation)
          );
          
          // Filtrer par durée maximale si spécifiée
          let filteredResults = searchResults;
          if (filters.maxDuration && filters.maxDuration > 0) {
            filteredResults = searchResults.filter(result => 
              !result.duration || result.duration <= filters.maxDuration
            );
          }
          
          console.log('✅ Résultats API Mapbox convertis:', filteredResults.length);
          setResults(filteredResults);
          
          // Mettre à jour le cache
          const newCache = new Map(searchCache);
          newCache.set(searchKey, { results: filteredResults, timestamp: now });
          
          if (newCache.size > 50) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          
          set({ 
            lastSearchParams: searchKey,
            searchCache: newCache
          }, false, 'updateSearchCache');
          
        } catch (error) {
          console.error('❌ Erreur lors de la recherche avec API Mapbox:', error);
          
          // Fallback avec données mockées en cas d'erreur
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
          
          // Mettre à jour l'erreur Mapbox
          set({ 
            mapboxError: error instanceof Error ? error.message : 'Erreur de recherche'
          }, false, 'searchError');
          
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
