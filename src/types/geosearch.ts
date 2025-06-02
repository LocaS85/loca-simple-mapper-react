
import { TransportMode } from "@/lib/data/transportModes";

export interface GeoSearchFilters {
  category: string | null;
  subcategory: string | null;
  transport: TransportMode;
  distance: number;
  unit: 'km' | 'mi';
  query: string;
  aroundMeCount: number;
  showMultiDirections: boolean;
  maxDuration: number;
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
  category: string;
  distance: number;
  duration: number;
}

export interface GeoLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

export interface GeoSearchState {
  userLocation: [number, number] | null;
  startingPosition: [number, number] | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  showFilters: boolean;
}
