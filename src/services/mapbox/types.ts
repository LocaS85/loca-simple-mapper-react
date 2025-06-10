
import { TransportMode } from '@/lib/data/transportModes';

export interface MapboxSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance?: number;
  relevance?: number;
  properties?: Record<string, any>;
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
  language?: string;
  country?: string;
  categories?: string[];
  bbox?: [number, number, number, number];
}

export interface MapboxDirectionsOptions {
  profile?: 'driving' | 'walking' | 'cycling';
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  overview?: 'full' | 'simplified' | 'false';
  steps?: boolean;
  continue_straight?: boolean;
  waypoint_snapping?: string[];
}

export interface MapboxIsochroneOptions {
  contours_minutes?: number[];
  contours_colors?: string[];
  polygons?: boolean;
  denoise?: number;
  generalize?: number;
}
