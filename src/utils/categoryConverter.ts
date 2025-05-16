
import { Category, Subcategory } from '@/types';
import { CategoryItem, SubcategoryItem } from '@/types/category';

/**
 * Converts the Category type to CategoryItem type by adding default values 
 * for missing required properties like description field in subcategories
 */
export function convertToCategory(item: Category): CategoryItem {
  return {
    id: item.id,
    name: item.name,
    icon: typeof item.icon === 'string' ? item.icon : '',
    color: item.color,
    subcategories: item.subcategories 
      ? item.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: `${item.name} - ${sub.name}`, // Default description
          icon: typeof sub.icon === 'string' ? sub.icon : ''
        }))
      : []
  };
}

/**
 * Converts an array of Category to an array of CategoryItem
 */
export function convertCategories(categories: Category[]): CategoryItem[] {
  return categories.map(category => convertToCategory(category));
}
