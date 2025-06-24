
import { StateCreator } from 'zustand';
import { GeoSearchStore, SearchResult } from './types';
import { mapboxApiService } from '@/services/mapboxApiService';
import { createCacheKey, createMockResults } from './searchLogic';
import { CacheService } from './cacheService';

const cacheService = new CacheService();

export const createGeoSearchActions = (
  set: (partial: Partial<GeoSearchStore>) => void,
  get: () => GeoSearchStore
) => ({
  setUserLocation: (location: [number, number] | null) => {
    set({ userLocation: location });
    if (location) {
      cacheService.clear();
    }
  },
    
  setStartingPosition: (position: [number, number] | null) => 
    set({ startingPosition: position }),
  
  initializeMapbox: async () => {
    try {
      console.log('🚀 Initialisation de l\'API Mapbox...');
      const isReady = await mapboxApiService.initialize();
      
      if (isReady) {
        set({ 
          isMapboxReady: true,
          mapboxError: null,
          networkStatus: 'online'
        });
        console.log('✅ Mapbox initialisé avec succès');
      } else {
        set({ 
          isMapboxReady: false,
          mapboxError: 'Token Mapbox invalide - utilisez un token public (pk.) pour le frontend',
          networkStatus: 'offline'
        });
      }
    } catch (error) {
      console.error('❌ Erreur d\'initialisation Mapbox:', error);
      set({ 
        isMapboxReady: false,
        mapboxError: error instanceof Error ? error.message : 'Erreur de connexion Mapbox',
        networkStatus: 'offline'
      });
    }
  },
  
  updateFilters: (newFilters: Partial<GeoSearchStore['filters']>) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    set({ filters: updatedFilters });
    
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
  },
    
  resetFilters: () => {
    const { defaultFilters } = get();
    set({ 
      filters: { ...defaultFilters }, 
      lastSearchParams: null 
    });
    cacheService.clear();
  },
  
  setResults: (results: SearchResult[]) => 
    set({ results }),
    
  setIsLoading: (loading: boolean) => 
    set({ isLoading: loading }),

  toggleFilters: () =>
    set((state) => ({ ...state, showFilters: !state.showFilters })),
    
  setShowFilters: (show: boolean) => 
    set({ showFilters: show }),

  setNetworkStatus: (status: 'online' | 'offline' | 'slow') =>
    set({ networkStatus: status }),

  incrementRetryCount: () =>
    set((state) => ({ ...state, retryCount: state.retryCount + 1 })),

  resetRetryCount: () =>
    set({ retryCount: 0 }),

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
      
      const searchResults = mapboxResults.map(result => ({
        ...result,
        address: result.address || 'Adresse non disponible'
      }));
      
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
    set({ searchCache: new Map() });
  }
});
