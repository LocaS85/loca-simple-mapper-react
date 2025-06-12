
import { useState, useCallback } from 'react';
import { Category } from '@/types/category';
import { convertToCategory, getAvailableCategories } from '@/utils/categoryConverter';

export const useCategoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories] = useState<Category[]>(() => {
    const availableCategories = getAvailableCategories();
    return availableCategories.map(cat => convertToCategory(cat));
  });

  const selectCategory = useCallback((categoryId: string) => {
    const found = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(found || null);
  }, [categories]);

  const clearSelection = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  return {
    categories,
    selectedCategory,
    selectCategory,
    clearSelection
  };
};
