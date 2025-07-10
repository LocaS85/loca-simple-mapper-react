// ============================================
// TYPES UNIFIÉS - VERSION CONSOLIDÉE FINALE
// ============================================

import { ComponentType } from 'react';

// ===== TYPES DE BASE UNIFIÉS =====
export type TransportMode = 'walking' | 'driving' | 'cycling' | 'transit' | 'car' | 'bus' | 'train';
export type DistanceUnit = 'km' | 'mi';
export type NetworkStatus = 'online' | 'offline' | 'pending' | 'slow';

// ===== GÉOLOCALISATION UNIFIÉE =====
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

// ===== DONNÉES DE LOCALISATION UNIFIÉES =====
export interface LocationData {
  id?: string;
  name: string;
  address?: string;
  coordinates: CoordinatesPair;
  placeName?: string;
  category?: string;
  description?: string;
  image?: string;
  price?: number;
}

// ===== RÉSULTATS DE RECHERCHE UNIFIÉS =====
// UNIQUE SearchResult interface - remplace TOUTES les autres définitions
export interface SearchResult {
  id: string;
  name: string;
  address?: string;
  coordinates: CoordinatesPair;
  type?: string;
  category?: string;
  distance?: number;
  duration?: number | string;
  rating?: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  price?: string | number;
  relevance?: number;
  properties?: Record<string, unknown>;
  description?: string;
  longitude?: number; // compatibility
  latitude?: number;  // compatibility
}

// Interfaces de compatibilité - à supprimer en Phase 2
export interface Place extends SearchResult {}
export interface MapResult {
  id: string;
  name: string;
  address?: string;
  coordinates: CoordinatesPair;
  distance: string;
  duration: string;
  category?: string;
}
export interface Location extends LocationData {}

// ===== SYSTÈME DE CATÉGORIES UNIFIÉ =====
// UNIQUE Category interface - remplace TOUTES les autres définitions
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string | ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  category_type?: string;
  subcategories?: CategoryItem[];
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  label?: string; // compatibility
}

// UNIQUE CategoryItem interface - remplace TOUTES les autres définitions
export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  icon: string | ComponentType<React.SVGProps<SVGSVGElement>>;
  searchTerms?: string[];
  category_id?: string;
  sort_order?: number;
  color?: string;
  label?: string; // compatibility
}

// Interfaces de sous-catégories
export interface Subcategory extends CategoryItem {
  parentId?: string;
}

export interface SubcategoryItem extends Subcategory {
  parentId: string;
}

// ===== ADRESSES UTILISATEUR =====
export interface DailyAddressItem {
  id: string;
  name: string;
  address: string;
  coordinates: CoordinatesPair;
  category: string;
  subcategory: string;
  isDaily: boolean;
  date: string;
  transport: TransportMode;
  distance: number;
  duration: number;
  unit: DistanceUnit;
}

export interface DailyAddressData extends DailyAddressItem {}

// ===== MODES DE TRANSPORT =====
export interface TransportModeItem {
  id?: string;
  name: string;
  icon: string | ComponentType;
  color: string;
  default_color?: string;
  mapbox_profile?: string;
  sort_order?: number;
}

// ===== FILTRES DE RECHERCHE UNIFIÉS =====
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

// ===== ÉTAT DE LA RECHERCHE UNIFIÉ =====
export interface GeoSearchState {
  userLocation: CoordinatesPair | null;
  startingPosition: CoordinatesPair | null;
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  isMapboxReady: boolean;
  networkStatus: NetworkStatus;
  statusInfo?: string;
  searchQuery?: string;
  showFilters?: boolean;
  mapboxError?: string | null;
  retryCount?: number;
  searchCache?: Map<string, SearchResult[]>;
  lastSearchParams?: Record<string, unknown>;
}

// ===== CONFIGURATION CARTE =====
export interface MapConfig {
  center: CoordinatesPair;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

// ===== OPTIONS D'ITINÉRAIRE =====
export interface RouteOptions {
  transportMode: TransportMode;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

// ===== POINT D'INTÉRÊT =====
export interface POI {
  id: string;
  name: string;
  coordinates: CoordinatesPair;
  category?: string;
  description?: string;
  distance?: number;
  duration?: number;
}

// ===== SERVICES MAPBOX UNIFIÉS =====
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

// ===== INTERFACE POUR COMPOSANTS =====
export interface SearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

// ===== CONSTANTES PAR DÉFAUT =====
export const DEFAULT_FILTERS: GeoSearchFilters = {
  transport: 'walking',
  distance: 5,
  aroundMeCount: 10,
  maxDuration: 30,
  unit: 'km',
  showMultiDirections: false
};

export const TRANSPORT_MODES: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'walking', label: 'À pied', icon: '🚶' },
  { value: 'driving', label: 'En voiture', icon: '🚗' },
  { value: 'cycling', label: 'À vélo', icon: '🚴' },
  { value: 'transit', label: 'Transport public', icon: '🚌' },
  { value: 'car', label: 'Voiture', icon: '🚗' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
  { value: 'train', label: 'Train', icon: '🚂' },
];

// ===== UTILITAIRES =====
export const getTransportModeInfo = (mode: TransportMode) => {
  return TRANSPORT_MODES.find(m => m.value === mode) || TRANSPORT_MODES[0];
};

export const isValidCoordinates = (coords: any): coords is CoordinatesPair => {
  return Array.isArray(coords) && 
         coords.length === 2 && 
         typeof coords[0] === 'number' && 
         typeof coords[1] === 'number';
};

// Helper function to convert DailyAddressData to DailyAddressItem
export const convertToDailyAddressItem = (data: DailyAddressData): DailyAddressItem => {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    coordinates: data.coordinates,
    category: data.category,
    subcategory: data.subcategory,
    isDaily: data.isDaily,
    date: data.date,
    transport: data.transport,
    distance: data.distance,
    duration: data.duration,
    unit: data.unit
  };
};