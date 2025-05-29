
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';
import { SearchResult } from '@/types/geosearch';
import { unifiedSearchService, SearchPlace } from '@/services/unifiedApiService';
import { filterSyncService } from './filterSync';

interface AppState {
  // État global de l'application
  isInitialized: boolean;
  userLocation: [number, number] | null;
  
  // Filtres unifiés
  filters: UnifiedFilters;
  
  // Résultats et cache
  searchResults: SearchResult[];
  searchCache: Map<string, SearchResult[]>;
  isLoading: boolean;
  lastSearchTime: number;
  
  // Interface utilisateur
  showFilters: boolean;
  activeView: 'map' | 'list' | 'grid';
  
  // Actions
  initializeApp: () => Promise<void>;
  setUserLocation: (location: [number, number] | null) => void;
  updateFilters: (filters: Partial<UnifiedFilters>) => void;
  performSearch: (force?: boolean) => Promise<void>;
  toggleFilters: () => void;
  setActiveView: (view: 'map' | 'list' | 'grid') => void;
  clearCache: () => void;
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

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        isInitialized: false,
        userLocation: null,
        filters: { ...defaultFilters },
        searchResults: [],
        searchCache: new Map(),
        isLoading: false,
        lastSearchTime: 0,
        showFilters: false,
        activeView: 'map',

        // Initialisation de l'application
        initializeApp: async () => {
          console.log('Initialisation de l\'application...');
          
          // Géolocalisation
          if (navigator.geolocation) {
            try {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000
                });
              });
              
              set({
                userLocation: [position.coords.longitude, position.coords.latitude],
                isInitialized: true
              });
            } catch (error) {
              console.warn('Géolocalisation échouée, utilisation de Paris par défaut');
              set({
                userLocation: [2.3522, 48.8566],
                isInitialized: true
              });
            }
          } else {
            set({
              userLocation: [2.3522, 48.8566],
              isInitialized: true
            });
          }
        },

        // Gestion de la localisation
        setUserLocation: (location) => {
          set({ userLocation: location });
          // Invalider le cache lors du changement de localisation
          if (location) {
            get().clearCache();
          }
        },

        // Mise à jour des filtres avec validation
        updateFilters: (newFilters) => {
          const currentFilters = get().filters;
          const updatedFilters = { ...currentFilters, ...newFilters };
          
          if (filterSyncService.validateFilters(updatedFilters)) {
            set({ filters: updatedFilters });
            
            // Recherche automatique après modification des filtres critiques
            const criticalFilters = ['category', 'subcategory', 'transport', 'distance', 'maxDuration'];
            const shouldSearch = Object.keys(newFilters).some(key => criticalFilters.includes(key));
            
            if (shouldSearch && get().userLocation) {
              // Debounce la recherche
              setTimeout(() => {
                get().performSearch();
              }, 500);
            }
          } else {
            console.warn('Filtres invalides ignorés:', newFilters);
          }
        },

        // Recherche avec cache et optimisations
        performSearch: async (force = false) => {
          const { userLocation, filters, searchCache, lastSearchTime } = get();
          
          if (!userLocation) {
            console.log('Aucune localisation disponible pour la recherche');
            return;
          }

          // Génération de la clé de cache
          const cacheKey = JSON.stringify({ 
            location: userLocation, 
            filters: filters 
          });

          // Vérifier le cache et la fréquence de recherche
          const now = Date.now();
          const timeSinceLastSearch = now - lastSearchTime;
          
          if (!force && searchCache.has(cacheKey) && timeSinceLastSearch < 30000) {
            console.log('Utilisation du cache pour les résultats');
            set({ searchResults: searchCache.get(cacheKey) || [] });
            return;
          }

          set({ isLoading: true, lastSearchTime: now });

          try {
            const searchParams = {
              ...filters,
              center: userLocation
            };

            const places = await unifiedSearchService.searchPlaces(searchParams);
            
            // Conversion vers SearchResult
            const results: SearchResult[] = places.map((place: SearchPlace) => ({
              id: place.id,
              name: place.name,
              address: place.address,
              coordinates: place.coordinates,
              type: place.category,
              category: place.category,
              distance: place.distance,
              duration: place.duration || 0
            }));

            // Mise à jour du cache et des résultats
            const newCache = new Map(searchCache);
            newCache.set(cacheKey, results);
            
            set({ 
              searchResults: results,
              searchCache: newCache
            });

            console.log(`Recherche terminée: ${results.length} résultats trouvés`);

          } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            set({ searchResults: [] });
          } finally {
            set({ isLoading: false });
          }
        },

        // Actions interface
        toggleFilters: () => set(state => ({ showFilters: !state.showFilters })),
        
        setActiveView: (view) => set({ activeView: view }),

        // Gestion du cache
        clearCache: () => set({ searchCache: new Map() })
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          filters: state.filters,
          activeView: state.activeView,
          userLocation: state.userLocation
        })
      }
    ),
    { name: 'app-store' }
  )
);
