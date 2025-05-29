import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { unifiedSearchService, SearchPlace } from '@/services/unifiedApiService';

interface GeoSearchState {
  // Position et localisation
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  
  // Filtres de recherche
  filters: GeoSearchFilters;
  
  // Résultats et état
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  
  // Actions pour la position
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  
  // Actions pour les filtres
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  
  // Actions pour les résultats
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Actions pour l'interface
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  
  // Actions de recherche
  loadResults: () => Promise<void>;
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

// Fonction de conversion entre les types
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
      
      // Actions pour la position
      setUserLocation: (location) => 
        set({ userLocation: location }, false, 'setUserLocation'),
        
      setStartingPosition: (position) => 
        set({ startingPosition: position }, false, 'setStartingPosition'),
      
      // Actions pour les filtres
      updateFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters }
          }),
          false,
          'updateFilters'
        ),
        
      resetFilters: () =>
        set({ filters: { ...defaultFilters } }, false, 'resetFilters'),
      
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
      
      // Action de recherche corrigée
      loadResults: async () => {
        const { userLocation, filters, setIsLoading, setResults } = get();
        
        if (!userLocation) {
          console.log('Aucune localisation utilisateur disponible pour la recherche');
          return;
        }
        
        setIsLoading(true);
        console.log('Chargement des résultats avec filtres:', filters);
        
        try {
          // Utiliser le service unifié avec paramètres corrigés
          const searchParams = {
            ...filters,
            center: userLocation,
            query: filters.query || '' // S'assurer que query est défini
          };

          const places = await unifiedSearchService.searchPlaces(searchParams);
          
          // Convertir vers le format SearchResult
          const searchResults = places.map(convertToSearchResult);
          
          console.log('Résultats Mapbox API convertis:', searchResults);
          setResults(searchResults);
          
        } catch (error) {
          console.error('Erreur lors du chargement des résultats:', error);
          
          // Fallback vers des données mockées
          const mockResults: SearchResult[] = Array.from({ length: filters.aroundMeCount }, (_, i) => ({
            id: `result-${i}`, 
            name: `${filters.category || 'Lieu'} ${filters.subcategory || 'Populaire'} ${i + 1}`, 
            address: `${123 + i} Nom de rue, ${filters.query || 'Paris'}`,
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
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'geo-search-store',
    }
  )
);
