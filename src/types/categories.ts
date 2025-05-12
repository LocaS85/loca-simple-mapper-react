
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
