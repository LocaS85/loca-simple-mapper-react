
import React from 'react';
import { Category } from '@/types/category';
import { renderIcon } from '@/utils/iconRenderer';

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`
            cursor-pointer bg-white rounded-lg p-4 shadow-sm border-2
            transition-all duration-200 hover:shadow-md
            ${selectedCategory === category.id ? 'border-blue-500' : 'border-gray-200'}
          `}
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="flex flex-col items-center space-y-2">
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: category.color + '20' }}
            >
              {renderIcon(category.icon, category.color, 20)}
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
