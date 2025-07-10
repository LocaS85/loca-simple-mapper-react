
import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types/unified';
import { renderIcon } from '@/utils/iconRenderer';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard3D: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: -5,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`
        cursor-pointer bg-white rounded-xl p-4 shadow-md
        h-full flex flex-col items-center justify-center
        border-2 transition-all duration-300 perspective-1000
        ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={onClick}
      style={{
        borderColor: isSelected ? category.color : undefined,
        boxShadow: isSelected ? `0 0 0 2px ${category.color}20` : undefined
      }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="p-3 rounded-full mb-2" 
          style={{ backgroundColor: category.color + '15' }}
        >
          {renderIcon(category.icon, category.color, 24)}
        </div>
        <h3 className="font-medium text-sm text-center leading-tight">
          {category.name}
        </h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard3D;
