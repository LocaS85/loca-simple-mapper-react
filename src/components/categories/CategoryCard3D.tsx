
import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types';

interface CategoryCard3DProps {
  category: Category;
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
        boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
        backgroundColor: category.color
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
        cursor-pointer rounded-xl p-4 group
        ${isSelected 
          ? 'text-white shadow-lg transform -translate-y-1' 
          : 'bg-white shadow-md hover:shadow-lg hover:text-white'
        }
        transition-all duration-300 perspective-1000
      `}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        {React.createElement(category.icon as React.ComponentType<any>, { 
          size: 24,
          className: "mb-1"
        })}
        <h3 className="text-sm md:text-base font-medium text-center">{category.name}</h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard3D;
