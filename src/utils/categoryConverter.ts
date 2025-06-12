
import { Category } from '@/types/category';
import { TransportMode } from '@/types/map';
import { fullCategories } from '@/data/fullCategories';

export interface ConvertedCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const convertCategories = (categories: any[]): ConvertedCategory[] => {
  return categories.map(category => ({
    id: category.id || category.value,
    name: category.name || category.label,
    icon: typeof category.icon === 'string' ? category.icon : '📍',
    description: category.description
  }));
};

export const convertToCategory = (item: any): Category => {
  return {
    id: item.id || item.value || item.name,
    name: item.name || item.label,
    icon: typeof item.icon === 'string' ? item.icon : '📍',
    description: item.description,
    subcategories: Array.isArray(item.subcategories) 
      ? item.subcategories.map((sub: any) => ({
          id: sub.id || sub.value || sub.name,
          name: sub.name || sub.label,
          icon: typeof sub.icon === 'string' ? sub.icon : '📍',
          description: sub.description
        }))
      : []
  };
};

export const getAvailableCategories = (): ConvertedCategory[] => {
  return convertCategories(fullCategories);
};

export const getCategoryById = (id: string): ConvertedCategory | undefined => {
  const categories = getAvailableCategories();
  return categories.find(cat => cat.id === id);
};
