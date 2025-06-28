
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  label: string;
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
  icon: string;
  color: string;
  description?: string;
  subcategories?: string[];
}
