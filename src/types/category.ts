
export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subcategories?: Category[];
}

export interface ConvertedCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

// Types manquants ajoutés
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subcategories?: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  parentId: string;
}

export interface DailyAddressItem {
  id: string;
  address: string;
  coordinates: [number, number];
  category: string;
  date: string;
  isDaily: boolean;
}
