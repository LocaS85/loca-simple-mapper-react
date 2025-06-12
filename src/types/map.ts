
import type { Map as MapboxMap } from 'mapbox-gl';

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'bus' | 'train' | 'transit';
export type DistanceUnit = 'km' | 'mi';

export interface POI {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  description?: string;
  address?: string;
  rating?: number;
  color?: string;
  icon?: string;
  imageUrl?: string;
}

export interface MapRef {
  getMap: () => MapboxMap;
}
