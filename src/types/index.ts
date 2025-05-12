
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'transit';

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;  // Make color required instead of optional
  subcategories?: Subcategory[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  description?: string;
  price?: number;
  coordinates: [number, number]; // [longitude, latitude]
  image?: string;
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

// Ajout de l'interface MapResult
export interface MapResult {
  id: string;
  name: string;
  address: string;
  distance?: string;
  duration?: string;
  coordinates: [number, number];
  category?: string;
}
