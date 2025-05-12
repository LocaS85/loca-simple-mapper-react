
import React from 'react';
import { motion } from 'framer-motion';
import { CategoryItem } from '../types/category';

interface CategoryCard3DProps {
  category: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard3D: React.FC<CategoryCard3DProps> = ({ 
  category,
  isSelected,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: -5,
        boxShadow: "0 20px 30px rgba(0,0,0,0.2)" 
      }}
      animate={{ 
        scale: isSelected ? 1.05 : 1,
        rotateY: isSelected ? 5 : 0,
        rotateX: isSelected ? -5 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={onClick}
      style={{ backgroundColor: isSelected ? category.color : undefined }}
      className={`
        cursor-pointer rounded-2xl p-5 
        ${isSelected 
          ? 'text-white shadow-lg transform -translate-y-1' 
          : 'bg-white shadow-md hover:shadow-lg'
        }
        transition-all duration-300 perspective-1000
      `}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-3">
        <span className="text-4xl">{category.icon}</span>
        <h3 className="text-lg font-medium text-center">{category.name}</h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard3D;
