
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

// Version unifiée de DailyAddressData avec id requis pour éviter les conflits
export interface DailyAddressData {
  id: string; // Maintenant requis pour la cohérence
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
