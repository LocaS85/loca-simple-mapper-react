
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { mapboxApiService } from '@/services/mapboxApiService';
import { filterSyncService } from './filterSync';

interface GeoSearchState {
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  lastSearchParams: string | null;
  searchCache: Map<string, { results: SearchResult[]; timestamp: number }>;
  isMapboxReady: boolean;
  mapboxError: string | null;
  
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
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

const convertMapboxToSearchResult = (mapboxResult: any, userLocation: [number, number]): SearchResult => {
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

const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371;
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
      
      setUserLocation: (location) => {
        set({ userLocation: location }, false, 'setUserLocation');
        if (location) {
          get().clearCache();
        }
      },
        
      setStartingPosition: (position) => 
        set({ startingPosition: position }, false, 'setStartingPosition'),
      
      initializeMapbox: async () => {
        try {
          console.log('🚀 Initialisation de l\'API Mapbox...');
          const isReady = await mapboxApiService.initialize();
          
          if (isReady) {
            set({ 
              isMapboxReady: true,
              mapboxError: null
            }, false, 'initializeMapbox');
            console.log('✅ Mapbox initialisé avec succès');
          } else {
            set({ 
              isMapboxReady: false,
              mapboxError: 'Token Mapbox invalide - utilisez un token public (pk.) pour le frontend'
            }, false, 'mapboxError');
          }
        } catch (error) {
          console.error('❌ Erreur d\'initialisation Mapbox:', error);
          set({ 
            isMapboxReady: false,
            mapboxError: error instanceof Error ? error.message : 'Erreur de connexion Mapbox'
          }, false, 'mapboxError');
        }
      },
      
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
        }
      },
        
      resetFilters: () => {
        set({ 
          filters: { ...defaultFilters }, 
          lastSearchParams: null 
        }, false, 'resetFilters');
        get().clearCache();
      },
      
      setResults: (results) => 
        set({ results }, false, 'setResults'),
        
      setIsLoading: (loading) => 
        set({ isLoading: loading }, false, 'setIsLoading'),
      
      toggleFilters: () =>
        set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
        
      setShowFilters: (show) => 
        set({ showFilters: show }, false, 'setShowFilters'),
      
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults, isMapboxReady } = get();
        
        if (!userLocation) {
          console.log('❌ Aucune localisation utilisateur disponible');
          return;
        }

        if (!isMapboxReady) {
          console.log('❌ API Mapbox non prête');
          await get().initializeMapbox();
          if (!get().isMapboxReady) {
            console.error('❌ Impossible d\'initialiser Mapbox');
            return;
          }
        }
        
        setIsLoading(true);
        console.log('🔍 Recherche avec localisation:', userLocation);
        
        try {
          let searchQuery = filters.query || '';
          if (filters.category && !searchQuery) {
            searchQuery = filters.category;
          }
          if (filters.subcategory) {
            searchQuery = `${searchQuery} ${filters.subcategory}`.trim();
          }
          
          if (!searchQuery) {
            searchQuery = 'restaurant';
          }

          console.log('🔍 Requête de recherche:', searchQuery);
          
          const mapboxResults = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
            limit: filters.aroundMeCount || 5,
            radius: filters.distance,
            categories: filters.category ? [filters.category] : undefined
          });
          
          console.log('📍 Résultats Mapbox reçus:', mapboxResults.length);
          
          const searchResults = mapboxResults.map(result => 
            convertMapboxToSearchResult(result, userLocation)
          );
          
          setResults(searchResults);
          console.log('✅ Résultats traités et stockés:', searchResults.length);
          
        } catch (error) {
          console.error('❌ Erreur de recherche:', error);
          
          // Données de test en cas d'erreur
          const mockResults: SearchResult[] = [
            {
              id: 'test-1',
              name: 'Restaurant Le Bon Goût',
              address: '123 Rue de la Paix, France',
              coordinates: [userLocation[0] + 0.001, userLocation[1] + 0.001] as [number, number],
              type: 'restaurant',
              category: 'restaurant',
              distance: 0.2,
              duration: 3
            }
          ];
          
          setResults(mockResults);
          console.log('🔧 Utilisation de données de test');
          
        } finally {
          setIsLoading(false);
        }
      },

      clearCache: () => {
        set({ searchCache: new Map() }, false, 'clearCache');
      }
    }),
    {
      name: 'geo-search-store',
    }
  )
);
