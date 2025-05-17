
import { Category } from '@/types';
import { FullCategory, FullSubcategory } from '@/data/fullCategories';

/**
 * Converts the FullCategory type to Category type
 */
export function convertToCategory(item: FullCategory): Category {
  return {
    id: item.id,
    name: item.name,
    icon: item.icon,
    color: item.color,
    subcategories: item.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      icon: sub.icon,
      description: sub.description || `${item.name} - ${sub.name}`
    }))
  };
}

/**
 * Converts an array of FullCategory to an array of Category
 */
export function convertCategories(categories: FullCategory[]): Category[] {
  return categories.map(category => convertToCategory(category));
}
