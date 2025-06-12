
import { TransportMode, DistanceUnit } from './map';

export interface SearchResult {
  id: string;
  name: string;
  address?: string;
  coordinates: [number, number];
  type: string;
  category?: string;
  distance?: number;
  duration?: number;
}

export interface GeoSearchFilters {
  query?: string;
  coordinates?: [number, number];
  category?: string;
  subcategory?: string;
  transport: TransportMode;
  distance: number;
  maxDuration?: number;
  aroundMeCount?: number;
  distanceUnit?: DistanceUnit;
  unit?: DistanceUnit;
  showMultiDirections?: boolean;
}

export interface GeoSearchState {
  userLocation: [number, number] | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  isMapboxReady: boolean;
  networkStatus: 'online' | 'offline' | 'slow';
  statusInfo?: string;
  searchQuery: string;
}

export interface GeoLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}
