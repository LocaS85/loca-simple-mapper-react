import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ModernCategoryCard from './ModernCategoryCard';
import CategoryScrollManager from './CategoryScrollManager';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

interface SearchCategoriesSectionProps {
  standardCategories: any[];
  onCategoryDetailClick: (category: any) => void;
}

const SearchCategoriesSection: React.FC<SearchCategoriesSectionProps> = ({
  standardCategories,
  onCategoryDetailClick
}) => {
  const scrollRef = useHorizontalScroll({
    sensitivity: 1,
    momentum: true
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <motion.div 
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white text-sm">🔍</span>
        </motion.div>
        Catégories de Recherche
      </h2>
      <div className="relative">
        {/* Smart scroll management */}
        <CategoryScrollManager 
          containerId="categories-scroll-container"
          itemCount={standardCategories.length}
          itemWidth={320}
        />
        
        {/* Horizontal scrolling container */}
        <div 
          ref={scrollRef}
          id="categories-scroll-container"
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 px-2 md:px-12 scroll-smooth scrollbar-hide scroll-touch scroll-snap-x"
        >
          <div className="flex gap-4 md:gap-6 min-w-max">
            {standardCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex-shrink-0 w-80 md:w-96 scroll-snap-center"
              >
                <ModernCategoryCard
                  category={category}
                  subcategories={category.subcategories || []}
                  transportMode="walking"
                  maxDistance={5}
                  distanceUnit="km"
                  aroundMeCount={3}
                  onDetailClick={() => onCategoryDetailClick(category)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex gap-2">
            {standardCategories.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
                id={`indicator-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SearchCategoriesSection;