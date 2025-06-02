import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mapboxApiService } from '@/services/mapboxApiService';
import { filterSyncService } from './filterSync';
import { GeoSearchState, initialState, defaultFilters } from './geoSearchStore/state';
import { GeoSearchActions } from './geoSearchStore/actions';
import { convertMapboxToSearchResult, createCacheKey, createMockResults } from './geoSearchStore/searchLogic';
import { CacheService } from './geoSearchStore/cacheService';

const cacheService = new CacheService();

export const useGeoSearchStore = create<GeoSearchState & GeoSearchActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setUserLocation: (location) => {
        set({ userLocation: location }, false, 'setUserLocation');
        if (location) {
          cacheService.clear();
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
              mapboxError: null,
              networkStatus: 'online'
            }, false, 'initializeMapbox');
            console.log('✅ Mapbox initialisé avec succès');
          } else {
            set({ 
              isMapboxReady: false,
              mapboxError: 'Token Mapbox invalide - utilisez un token public (pk.) pour le frontend',
              networkStatus: 'offline'
            }, false, 'mapboxError');
          }
        } catch (error) {
          console.error('❌ Erreur d\'initialisation Mapbox:', error);
          set({ 
            isMapboxReady: false,
            mapboxError: error instanceof Error ? error.message : 'Erreur de connexion Mapbox',
            networkStatus: 'offline'
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
        cacheService.clear();
      },
      
      setResults: (results) => 
        set({ results }, false, 'setResults'),
        
      setIsLoading: (loading) => 
        set({ isLoading: loading }, false, 'setIsLoading'),
      
      toggleFilters: () =>
        set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
        
      setShowFilters: (show) => 
        set({ showFilters: show }, false, 'setShowFilters'),

      setNetworkStatus: (status) =>
        set({ networkStatus: status }, false, 'setNetworkStatus'),

      incrementRetryCount: () =>
        set((state) => ({ retryCount: state.retryCount + 1 }), false, 'incrementRetryCount'),

      resetRetryCount: () =>
        set({ retryCount: 0 }, false, 'resetRetryCount'),

      performSearch: async (query?: string) => {
        const { filters, updateFilters, loadResults } = get();
        
        if (query) {
          updateFilters({ query });
        }
        
        await loadResults();
      },
      
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults, isMapboxReady, retryCount } = get();
        
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

        // Check cache first
        const cacheKey = createCacheKey(filters, userLocation);
        const cachedResults = cacheService.get(cacheKey);
        if (cachedResults) {
          console.log('📦 Résultats trouvés en cache');
          setResults(cachedResults);
          return;
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
          
          // Cache the results
          cacheService.set(cacheKey, searchResults);
          
          setResults(searchResults);
          get().resetRetryCount();
          get().setNetworkStatus('online');
          console.log('✅ Résultats traités et stockés:', searchResults.length);
          
        } catch (error) {
          console.error('❌ Erreur de recherche:', error);
          
          if (retryCount < 2) {
            console.log(`🔄 Tentative ${retryCount + 1}/3`);
            get().incrementRetryCount();
            get().setNetworkStatus('slow');
            
            setTimeout(() => {
              get().loadResults();
            }, 1000 * (retryCount + 1));
            return;
          }
          
          get().setNetworkStatus('offline');
          const mockResults = createMockResults(userLocation);
          setResults(mockResults);
          console.log('🔧 Utilisation de données de test après échec');
          
        } finally {
          setIsLoading(false);
        }
      },

      clearCache: () => {
        cacheService.clear();
        set({ searchCache: new Map() }, false, 'clearCache');
      }
    }),
    {
      name: 'geo-search-store',
    }
  )
);
