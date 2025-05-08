
import React from 'react';
import { Category } from '../types';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

// Sample categories - in a real app these might come from an API
const categories: Category[] = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
  { id: 'cafe', name: 'Cafés', icon: '☕' },
  { id: 'bar', name: 'Bars', icon: '🍸' },
  { id: 'park', name: 'Parcs', icon: '🌳' },
  { id: 'hotel', name: 'Hôtels', icon: '🏨' },
  { id: 'shop', name: 'Commerces', icon: '🛍️' },
  { id: 'attraction', name: 'Attractions', icon: '🎡' },
  { id: 'museum', name: 'Musées', icon: '🏛️' },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Catégorie</h3>
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(selectedCategory?.id === category.id ? null : category)}
            className={`flex flex-col items-center p-3 rounded-lg ${
              selectedCategory?.id === category.id 
                ? 'bg-blue-100 ring-2 ring-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xs mt-1 text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
