import { GeoSearchStore, SearchResult } from './types';
import { mapboxApiService } from '@/services/mapboxApiService';
import { createCacheKey, createMockResults } from './searchLogic';
import { CacheService } from './cacheService';

const cacheService = new CacheService();

export const createGeoSearchActions = (
  set: (partial: Partial<GeoSearchStore> | ((state: GeoSearchStore) => Partial<GeoSearchStore>)) => void,
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
  
  setFiltersFromParams: (params: Record<string, string>) => {
    const { updateFilters } = get();
    const newFilters: Partial<GeoSearchStore['filters']> = {};
    
    if (params.query) newFilters.query = params.query;
    if (params.category) newFilters.category = params.category;
    if (params.subcategory) newFilters.subcategory = params.subcategory;
    if (params.transport) newFilters.transport = params.transport as 'walking' | 'cycling' | 'driving' | 'transit';
    if (params.distance) newFilters.distance = parseInt(params.distance);
    if (params.maxDuration) newFilters.maxDuration = parseInt(params.maxDuration);
    if (params.aroundMeCount) newFilters.aroundMeCount = parseInt(params.aroundMeCount);
    if (params.unit) newFilters.unit = params.unit as 'km' | 'mi';
    if (params.showMultiDirections) newFilters.showMultiDirections = params.showMultiDirections === 'true';
    
    updateFilters(newFilters);
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
    set((state) => ({ showFilters: !state.showFilters })),
    
  setShowFilters: (show: boolean) => 
    set({ showFilters: show }),

  setNetworkStatus: (status: 'online' | 'offline' | 'slow') =>
    set({ networkStatus: status }),

  incrementRetryCount: () =>
    set((state) => ({ retryCount: state.retryCount + 1 })),

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
      
      // Transformer les résultats pour s'assurer de la compatibilité des types
      const searchResults: SearchResult[] = mapboxResults.map(result => ({
        id: result.id,
        name: result.name,
        address: result.address, // Déjà optionnel dans mapboxApiService
        coordinates: result.coordinates,
        type: result.category || 'point_of_interest',
        category: result.category,
        distance: result.distance,
        duration: result.duration,
        rating: result.rating,
        phone: result.phone,
        website: result.website,
        openingHours: result.openingHours,
        price: result.price
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
      // Transformer les résultats mock pour garantir la compatibilité
      const transformedMockResults: SearchResult[] = mockResults.map(result => ({
        ...result,
        address: result.address || 'Adresse non disponible'
      }));
      setResults(transformedMockResults);
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
