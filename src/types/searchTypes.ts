
export interface SearchResultData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: number;
  category?: string;
  type?: string;
}

export interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

export interface SearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  onLocationSelect: (location: LocationSelectData) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export interface SearchOptions {
  limit?: number;
  radius?: number;
  language?: string;
  categories?: string[];
}

export interface GeocodingResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: number;
  properties?: Record<string, unknown>;
}
