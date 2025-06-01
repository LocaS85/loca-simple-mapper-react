
export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface GeoSearchState {
  position: GeolocationPosition | null;
  searchQuery: string;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
  category: string;
  distance: number;
  duration?: number;
  relevance?: number;
}

export interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export interface SearchOptions {
  radius: number;
  maxResults: number;
  categories?: string[];
  sortBy?: 'distance' | 'relevance' | 'name';
}
