
import { TransportMode } from ".";

export interface GeoSearchFilters {
  category: string | null;
  subcategory: string | null;
  transport: TransportMode;
  distance: number;
  unit: 'km' | 'mi';
  query?: string;
  aroundMeCount: number;
  showMultiDirections: boolean;
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
