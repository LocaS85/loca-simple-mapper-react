
import { TransportMode } from '@/types';

export interface MapboxSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  relevance?: number;
}

export interface MapboxDirectionsResult {
  geometry: any;
  distance: number;
  duration: number;
  steps?: any[];
}

export interface MapboxSearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}
