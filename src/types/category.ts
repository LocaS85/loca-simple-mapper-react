
export interface SubcategoryItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: SubcategoryItem[];
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
