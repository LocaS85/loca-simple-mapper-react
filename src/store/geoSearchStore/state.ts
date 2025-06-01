
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';

export interface GeoSearchState {
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
  lastSearchParams: string | null;
  searchCache: Map<string, { results: SearchResult[]; timestamp: number; expiry: number }>;
  isMapboxReady: boolean;
  mapboxError: string | null;
  networkStatus: 'online' | 'offline' | 'slow';
  retryCount: number;
}

export const defaultFilters: GeoSearchFilters = {
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

export const initialState: GeoSearchState = {
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
  networkStatus: 'online',
  retryCount: 0
};
