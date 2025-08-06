
// IMPORT FROM UNIFIED TYPES
import type { 
  SearchResult, 
  GeoSearchFilters, 
  CoordinatesPair,
  NetworkStatus
} from '@/types/unified';
import { DEFAULT_FILTERS } from '@/types/unified';

// RE-EXPORT FOR EXTERNAL USE
export type { SearchResult, GeoSearchFilters, CoordinatesPair, NetworkStatus };

export interface GeoSearchStore {
  // State
  userLocation: CoordinatesPair | null;
  startingPosition: CoordinatesPair | null;
  filters: GeoSearchFilters;
  defaultFilters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  sidebarOpen: boolean;
  isMapboxReady: boolean;
  mapboxError: string | null;
  networkStatus: NetworkStatus;
  retryCount: number;
  searchCache: Map<string, SearchResult[]>;
  lastSearchParams: Record<string, unknown>;

  // Actions
  setUserLocation: (location: CoordinatesPair | null) => void;
  setStartingPosition: (position: CoordinatesPair | null) => void;
  initializeMapbox: () => Promise<void>;
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  setFiltersFromParams: (params: Record<string, string>) => void;
  resetFilters: () => void;
  setResults: (results: SearchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setNetworkStatus: (status: NetworkStatus) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  performSearch: (query?: string) => Promise<void>;
  loadResults: () => Promise<void>;
  clearCache: () => void;
}

export const defaultFilters: GeoSearchFilters = DEFAULT_FILTERS;

export const initialState = {
  userLocation: null as CoordinatesPair | null,
  startingPosition: null as CoordinatesPair | null,
  filters: { ...defaultFilters },
  defaultFilters: { ...defaultFilters },
  results: [] as SearchResult[],
  isLoading: false,
  showFilters: false,
  sidebarOpen: false,
  isMapboxReady: false,
  mapboxError: null as string | null,
  networkStatus: 'online' as NetworkStatus,
  retryCount: 0,
  searchCache: new Map<string, SearchResult[]>(),
  lastSearchParams: {} as Record<string, unknown>
};
