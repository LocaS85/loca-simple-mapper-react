
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

// Suppression de DailyAddressData pour éviter le conflit - utiliser celui de types/category.ts
export type TransportMode = "car" | "walking" | "cycling" | "bus" | "train" | "driving" | "transit";

// Updated Location interface with image and price properties
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category?: string;
  description?: string;
  image?: string;
  price?: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: number;
  duration?: number;
  category?: string;
  type?: string;
  longitude?: number;
  latitude?: number;
}

export interface MapResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance: string;
  duration: string;
  category?: string;
}

export interface SearchParams {
  query: string;
  proximity: [number, number];
  limit?: number;
  radius?: number;
  categories?: string[];
}
