
import { SearchResult, GeoSearchFilters, LocationData } from '@/types/geosearch';
import { TransportMode, DistanceUnit } from '@/types/map';

export const defaultFilters: GeoSearchFilters = {
  query: '',
  transport: 'walking',
  distance: 10,
  maxDuration: 30,
  aroundMeCount: 5,
  unit: 'km',
  showMultiDirections: false
};

export interface GeoSearchStore {
  // State
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  isMapboxReady: boolean;
  mapboxError: string | null;
  networkStatus: 'online' | 'offline' | 'slow';
  showFilters: boolean;
  retryCount: number;
  searchCache: Map<string, SearchResult[]>;
  lastSearchParams: string | null;

  // Actions
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  initializeMapbox: () => Promise<void>;
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  setNetworkStatus: (status: 'online' | 'offline' | 'slow') => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  performSearch: (query?: string) => Promise<void>;
  loadResults: () => Promise<void>;
  clearCache: () => void;
}

export const initialState = {
  userLocation: null,
  startingPosition: null,
  filters: defaultFilters,
  results: [],
  isLoading: false,
  isMapboxReady: false,
  mapboxError: null,
  networkStatus: 'online' as const,
  showFilters: false,
  retryCount: 0,
  searchCache: new Map<string, SearchResult[]>(),
  lastSearchParams: null
};
