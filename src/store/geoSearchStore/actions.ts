
import { GeoSearchState } from './state';
import { GeoSearchFilters } from '@/types/geosearch';

export interface GeoSearchActions {
  setUserLocation: (location: [number, number] | null) => void;
  setStartingPosition: (position: [number, number] | null) => void;
  updateFilters: (newFilters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  setResults: (results: any[]) => void;
  setIsLoading: (loading: boolean) => void;
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;
  loadResults: () => Promise<void>;
  initializeMapbox: () => Promise<void>;
  clearCache: () => void;
  setNetworkStatus: (status: 'online' | 'offline' | 'slow') => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
}
