
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
  rating?: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  price?: string;
}

export interface LocationData {
  name: string;
  coordinates: [number, number];
  placeName: string;
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
  unit?: DistanceUnit;
  showMultiDirections?: boolean;
  selectedLocation?: LocationData;
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
