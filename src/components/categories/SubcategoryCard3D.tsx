
import React from 'react';
import { motion } from 'framer-motion';

interface SubcategoryCardProps {
  subcategory: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    description?: string;
  };
  parentCategoryId: string;
  parentCategoryColor: string;
}

const SubcategoryCard3D: React.FC<SubcategoryCardProps> = ({ 
  subcategory,
  parentCategoryId,
  parentCategoryColor
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        rotateY: 5,
        rotateX: -5,
        boxShadow: "0 15px 25px rgba(0,0,0,0.1)" 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`
        bg-white rounded-xl p-4 shadow-md
        h-full flex flex-col items-center
        border-l-4 hover:shadow-lg
        transition-all duration-300 perspective-1000
      `}
      style={{ borderColor: parentCategoryColor }}
    >
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full mb-3" style={{ backgroundColor: parentCategoryColor + '15' }}>
          {React.createElement(subcategory.icon, { 
            size: 24,
            color: parentCategoryColor,
            strokeWidth: 2
          })}
        </div>
        <h3 className="font-medium text-lg mb-1 text-center">{subcategory.name}</h3>
        {subcategory.description && (
          <p className="text-sm text-gray-500 text-center">{subcategory.description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default SubcategoryCard3D;
