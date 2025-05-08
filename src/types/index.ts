
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'transit';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  distance?: number;
  duration?: number;
  category?: string;
}

export interface SearchParams {
  query: string;
  proximity: [number, number];
  limit: number;
  radius: number;
  categories?: string[];
}

export interface MapboxConfig {
  accessToken: string;
  style: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}
