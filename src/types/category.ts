
import { ComponentType, ReactNode } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  subcategories: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DailyAddressItem {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  subcategory: string;
  transportMode?: string;
}
