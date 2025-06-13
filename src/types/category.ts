
import { TransportMode, DistanceUnit } from '@/types/map';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

export interface CategoryItem extends Category {}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
}

export interface SubcategoryItem extends Subcategory {
  icon: string;
  parentId: string;
}

export interface DailyAddressItem {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  subcategory: string;
  isDaily: boolean;
  date: string;
  transport: TransportMode;
  distance: number;
  duration: number;
  unit: DistanceUnit;
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

// Helper function to convert DailyAddressData to DailyAddressItem
export const convertToDailyAddressItem = (data: DailyAddressData): DailyAddressItem => {
  return {
    id: data.id || `temp-${Date.now()}`,
    name: data.name,
    address: data.address,
    coordinates: data.coordinates,
    category: data.category || '',
    subcategory: data.subcategory || '',
    isDaily: data.isDaily || true,
    date: data.date || new Date().toISOString(),
    transport: data.transport || 'walking',
    distance: data.distance || 0,
    duration: data.duration || 0,
    unit: data.unit || 'km'
  };
};
