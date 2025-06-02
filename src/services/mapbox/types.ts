
import { TransportMode } from '@/lib/data/transportModes';

export interface MapboxSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  relevance?: number;
  properties?: Record<string, any>;
}

export interface MapboxDirectionsResult {
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
  distance: number;
  duration: number;
  steps?: any[];
}

export interface MapboxSearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
  types?: string[];
  country?: string;
  bbox?: [number, number, number, number];
  language?: string;
}

export interface MapboxGeocodingFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    category?: string;
    address?: string;
    wikidata?: string;
    short_code?: string;
    maki?: string;
  };
  context?: {
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }[];
}

export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxGeocodingFeature[];
  attribution: string;
}
