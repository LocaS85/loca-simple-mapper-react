// ============================================
// TYPES UNIFIÉS - VERSION CONSOLIDÉE
// ============================================

// TYPES DE BASE
export type TransportMode = 'walking' | 'driving' | 'cycling' | 'transit';
export type DistanceUnit = 'km' | 'mi';
export type NetworkStatus = 'online' | 'offline' | 'slow';

// GÉOLOCALISATION
export interface Coordinates {
  longitude: number;
  latitude: number;
}

export type CoordinatesPair = [number, number]; // [longitude, latitude]

export interface GeoLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// DONNÉES DE LOCALISATION
export interface LocationData {
  name: string;
  coordinates: CoordinatesPair;
  placeName: string;
}

// RÉSULTATS DE RECHERCHE
export interface SearchResult {
  id: string;
  name: string;
  address?: string;
  coordinates: CoordinatesPair;
  type: string;
  category?: string;
  distance?: number;
  duration?: number;
  rating?: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  price?: string;
  relevance?: number;
  properties?: Record<string, unknown>;
}

// CATÉGORIES
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  subcategories?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  label: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
    description: string;
  }[];
}

// FILTRES DE RECHERCHE
export interface GeoSearchFilters {
  query?: string;
  coordinates?: CoordinatesPair;
  category?: string;
  subcategory?: string;
  transport: TransportMode;
  distance: number;
  maxDuration?: number;
  aroundMeCount?: number;
  unit?: DistanceUnit;
  showMultiDirections?: boolean;
  selectedLocation?: LocationData;
}

// ÉTAT DE LA RECHERCHE
export interface GeoSearchState {
  userLocation: CoordinatesPair | null;
  startingPosition: CoordinatesPair | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  isMapboxReady: boolean;
  networkStatus: NetworkStatus;
  statusInfo?: string;
  searchQuery: string;
}

// CONFIGURATION CARTE
export interface MapConfig {
  center: CoordinatesPair;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

// OPTIONS D'ITINÉRAIRE
export interface RouteOptions {
  transportMode: TransportMode;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

// POINT D'INTÉRÊT
export interface POI {
  id: string;
  name: string;
  coordinates: CoordinatesPair;
  category?: string;
  description?: string;
  distance?: number;
  duration?: number;
}

// SERVICES MAPBOX
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

export interface MapboxDirectionsResult {
  geometry: any; // GeoJSON geometry
  distance: number;
  duration: number;
  steps?: any[];
}

export interface MapboxIsochroneOptions {
  contours_minutes?: number[];
  contours_colors?: string[];
  polygons?: boolean;
  denoise?: number;
  generalize?: number;
}

// CONSTANTES PAR DÉFAUT
export const DEFAULT_FILTERS: GeoSearchFilters = {
  transport: 'walking',
  distance: 5,
  aroundMeCount: 5,
  maxDuration: 30,
  unit: 'km',
  showMultiDirections: false
};

export const TRANSPORT_MODES: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'walking', label: 'À pied', icon: '🚶' },
  { value: 'driving', label: 'En voiture', icon: '🚗' },
  { value: 'cycling', label: 'À vélo', icon: '🚴' },
  { value: 'transit', label: 'Transport public', icon: '🚌' },
];

// UTILITAIRES
export const getTransportModeInfo = (mode: TransportMode) => {
  return TRANSPORT_MODES.find(m => m.value === mode) || TRANSPORT_MODES[0];
};

export const isValidCoordinates = (coords: any): coords is CoordinatesPair => {
  return Array.isArray(coords) && 
         coords.length === 2 && 
         typeof coords[0] === 'number' && 
         typeof coords[1] === 'number';
};