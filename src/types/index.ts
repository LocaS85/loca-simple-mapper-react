
import { ComponentType, ReactNode } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  label: string;
  icon: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: ComponentType | string;
  subcategories: {
    id: string;
    name: string;
    icon: ComponentType | string;
    description?: string;
  }[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
}

export interface TransportModeItem {
  name: string;
  icon: string | ComponentType;
  color: string;
}

export interface DailyAddressData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  subcategory: string;
  transportMode?: string;
}

export type TransportMode = "car" | "walking" | "cycling" | "bus" | "train";
