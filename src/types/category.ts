
import { TransportMode, DistanceUnit } from './map';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  label: string;
  color: string;
  subcategories?: SubcategoryItem[];
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
}

export interface SubcategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId: string;
}

export interface DailyAddressItem {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category?: string;
  subcategory?: string;
  isDaily: boolean;
  date: string;
  transport?: TransportMode;
  distance?: number;
  duration?: number;
  unit?: DistanceUnit;
}

export interface DailyAddressData {
  id?: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category?: string;
  subcategory?: string;
  isDaily?: boolean;
  date?: string;
  transport?: TransportMode;
  distance?: number;
  duration?: number;
  unit?: DistanceUnit;
}

export interface CategorySearchFilters {
  transportMode: TransportMode;
  maxDistance: number;
  maxDuration: number;
  aroundMeCount: number;
  showMultiDirections: boolean;
  distanceUnit: DistanceUnit;
}
