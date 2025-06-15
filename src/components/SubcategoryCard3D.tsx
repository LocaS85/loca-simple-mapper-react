
import React from 'react';
import { motion } from 'framer-motion';
import { SubcategoryItem } from '../types/category';
import { Link } from 'react-router-dom';
import { renderIcon } from '@/utils/iconRenderer';

interface SubcategoryCard3DProps {
  subcategory: SubcategoryItem;
  parentCategoryId: string;
  parentCategoryColor: string;
}

const SubcategoryCard3D: React.FC<SubcategoryCard3DProps> = ({ 
  subcategory,
  parentCategoryId,
  parentCategoryColor
}) => {
  return (
    <Link to={`/search?category=${parentCategoryId}&subcategory=${subcategory.id}`}>
      <motion.div
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          rotateX: -5,
          boxShadow: "0 15px 25px rgba(0,0,0,0.15)" 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className={`
          cursor-pointer bg-white rounded-xl p-4 shadow-md
          h-full flex flex-col items-center
          border-l-4 hover:shadow-lg
          transition-all duration-300 perspective-1000
        `}
        style={{ borderColor: parentCategoryColor }}
      >
        <div className="mb-3">
          {renderIcon(subcategory.icon, parentCategoryColor, 32)}
        </div>
        <h3 className="font-medium text-lg mb-1">{subcategory.name}</h3>
        <p className="text-sm text-gray-500 text-center">{subcategory.description}</p>
      </motion.div>
    </Link>
  );
};

export default SubcategoryCard3D;
