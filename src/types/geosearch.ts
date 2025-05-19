
import { TransportMode } from '@/types';

export interface GeoSearchFilters {
  query?: string;
  category?: string | null;
  subcategory?: string | null;
  transport: TransportMode;
  distance: number;
  unit: 'km' | 'mi';
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category?: string;
  type?: string;
  distance?: number;
  duration?: number;
}
