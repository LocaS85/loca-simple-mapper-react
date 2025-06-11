
import type { Map, Marker, Popup } from 'mapbox-gl';

declare global {
  interface Window {
    mapboxgl: typeof import('mapbox-gl');
  }
}

export interface MapboxSearchResult {
  id: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    address?: string;
    category?: string;
    tel?: string;
    website?: string;
  };
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export interface MapboxGeocodingOptions {
  proximity?: [number, number];
  bbox?: [number, number, number, number];
  country?: string;
  types?: string[];
  limit?: number;
  language?: string;
  autocomplete?: boolean;
  fuzzyMatch?: boolean;
}

export interface MapboxDirectionsResponse {
  routes: Array<{
    geometry: object;
    distance: number;
    duration: number;
    legs: Array<{
      distance: number;
      duration: number;
      steps: Array<{
        geometry: object;
        distance: number;
        duration: number;
        instruction: string;
      }>;
    }>;
  }>;
}

export type MapboxEventHandler = (...args: any[]) => void;
