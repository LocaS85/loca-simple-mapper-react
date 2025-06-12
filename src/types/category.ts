
import { DistanceUnit } from './map';

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  subcategories?: Category[];
}

export interface ConvertedCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  subcategories?: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  parentId: string;
  color?: string;
}

export interface DailyAddressItem {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  subcategory?: string;
  date: string;
  isDaily: boolean;
  transportMode?: string;
}

export interface DailyAddressData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  subcategory?: string;
  transportMode?: string;
  date?: string;
  isDaily?: boolean;
}
