
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
    console.log('🏪 STORE: setUserLocation appelé avec:', location);
    set({ userLocation: location });
    if (location) {
      console.log('🗑️ Cache vidé car nouvelle position');
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
    
    console.log('🚀 Début loadResults avec:', { userLocation, filters, isMapboxReady });
    
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
      console.log('📦 Résultats trouvés en cache:', cachedResults.length);
      setResults(cachedResults);
      return;
    }
    
    setIsLoading(true);
    console.log('🔍 Recherche avec localisation:', userLocation);
    
    try {
      // Construire la requête de recherche
      let searchQuery = filters.query || '';
      if (filters.category && !searchQuery) {
        searchQuery = filters.category;
      }
      if (filters.subcategory) {
        searchQuery = `${searchQuery} ${filters.subcategory}`.trim();
      }
      
      // Par défaut, rechercher des restaurants si pas de requête
      if (!searchQuery) {
        searchQuery = 'restaurant';
      }

      console.log('🔍 Requête de recherche:', searchQuery, 'avec filtres:', filters);
      
      // Appel API Mapbox
      const mapboxResults = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
        limit: filters.aroundMeCount || 5,
        radius: filters.distance || 5,
        categories: filters.category ? [filters.category] : undefined
      });
      
      console.log('📍 Résultats Mapbox reçus:', mapboxResults.length, mapboxResults);
      
      // Transformer les résultats avec toutes les propriétés requises
      const searchResults: SearchResult[] = mapboxResults.map((result, index) => ({
        id: result.id || `result-${index}`,
        name: result.name || 'Lieu sans nom',
        address: result.address || 'Adresse non disponible',
        coordinates: result.coordinates,
        type: result.type || 'place',
        category: result.category || filters.category || 'restaurant',
        distance: result.distance,
        duration: result.duration,
        rating: result.rating || undefined,
        phone: result.phone || undefined,
        website: result.website || undefined,
        openingHours: result.openingHours || undefined,
        price: result.price || undefined
      }));
      
      console.log('🏷️ Résultats transformés:', searchResults);
      
      // Cache the results
      cacheService.set(cacheKey, searchResults);
      
      setResults(searchResults);
      get().resetRetryCount();
      get().setNetworkStatus('online');
      console.log('✅ Résultats traités et stockés:', searchResults.length);
      
    } catch (error) {
      console.error('❌ Erreur de recherche détaillée:', error);
      
      if (retryCount < 2) {
        console.log(`🔄 Tentative ${retryCount + 1}/3`);
        get().incrementRetryCount();
        get().setNetworkStatus('slow');
        
        setTimeout(() => {
          get().loadResults();
        }, 1000 * (retryCount + 1));
        return;
      }
      
      // Fallback vers données de test
      get().setNetworkStatus('offline');
      const mockResults = createMockResults(userLocation);
      const transformedMockResults: SearchResult[] = mockResults.map(result => ({
        ...result,
        address: result.address || 'Adresse non disponible',
        rating: undefined,
        phone: undefined,
        website: undefined,
        openingHours: undefined,
        price: undefined
      }));
      setResults(transformedMockResults);
      console.log('🔧 Utilisation de données de test:', transformedMockResults.length);
      
    } finally {
      setIsLoading(false);
    }
  },

  clearCache: () => {
    cacheService.clear();
    set({ searchCache: new Map() });
  }
});
