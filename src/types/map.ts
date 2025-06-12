
import type { Map as MapboxMap } from 'mapbox-gl';

export type TransportMode = 'car' | 'walking' | 'cycling' | 'bus' | 'train' | 'driving' | 'transit';

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
