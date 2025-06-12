
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
