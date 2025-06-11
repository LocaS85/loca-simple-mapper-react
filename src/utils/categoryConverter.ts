
import { Category } from '@/types';
import { CategoryData, fullCategories } from '@/data/fullCategories';

interface FullCategory extends CategoryData {
  // Propriétés supplémentaires pour les catégories complètes
}

interface FullSubcategory {
  id: string;
  name: string;
  parentId: string;
}

export const convertCategoryToFull = (category: Category): FullCategory => {
  const fullCategory = fullCategories.find(fc => fc.id === category.id);
  
  if (!fullCategory) {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon || '📍',
      subcategories: []
    };
  }
  
  return fullCategory;
};

export const convertFullCategoryToCategory = (fullCategory: FullCategory): Category => {
  return {
    id: fullCategory.id,
    name: fullCategory.name,
    icon: fullCategory.icon,
    color: '#3B82F6', // Couleur par défaut
    subcategories: fullCategory.subcategories || []
  };
};
