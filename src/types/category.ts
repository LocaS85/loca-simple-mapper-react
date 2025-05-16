
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
