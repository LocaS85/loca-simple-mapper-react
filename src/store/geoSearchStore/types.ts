
export interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
  distance?: number;
  duration?: number;
  category?: string;
  rating?: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  price?: string;
}

export interface GeoSearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  transport: 'walking' | 'cycling' | 'driving' | 'transit';
  distance: number;
  maxDuration?: number;
  aroundMeCount: number;
  unit?: 'km' | 'mi';
  showMultiDirections?: boolean;
  coordinates?: [number, number];
}

export interface GeoSearchStore {
  // State
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  filters: GeoSearchFilters;
  defaultFilters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  isMapboxReady: boolean;
  mapboxError: string | null;
  networkStatus: 'online' | 'offline' | 'slow';
  retryCount: number;
  searchCache: Map<string, SearchResult[]>;
  lastSearchParams: any;

  // Actions
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  initializeMapbox: () => Promise<void>;
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
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

export const defaultFilters: GeoSearchFilters = {
  transport: 'walking',
  distance: 5,
  aroundMeCount: 5,
  maxDuration: 30,
  unit: 'km',
  showMultiDirections: false
};

export const initialState = {
  userLocation: null,
  startingPosition: null,
  filters: { ...defaultFilters },
  defaultFilters: { ...defaultFilters },
  results: [],
  isLoading: false,
  showFilters: false,
  isMapboxReady: false,
  mapboxError: null,
  networkStatus: 'online' as const,
  retryCount: 0,
  searchCache: new Map(),
  lastSearchParams: null
};
