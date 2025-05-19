
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CategoryCard3D from '@/components/categories/CategoryCard3D';
import SubcategoriesList from '@/components/categories/SubcategoriesList';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { TransportMode } from '@/lib/data/transportModes';
import { useNavigate } from 'react-router-dom';

interface CategorySectionProps {
  categories: Category[];
  dailyAddresses: any[];
  onEditAddress: (address: any) => void;
  onDeleteAddress: (addressId: string) => void;
  onAddNewAddress: (subcategoryId: string) => void;
  onSelectCategory?: (category: Category) => void;
  selectedCategory: Category | null;
  transportMode: TransportMode;
  maxDistance: number;
  maxDuration: number;
  distanceUnit: 'km' | 'mi';
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  dailyAddresses,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress,
  onSelectCategory,
  selectedCategory,
  transportMode,
  maxDistance,
  maxDuration,
  distanceUnit
}) => {
  const [animateDirection, setAnimateDirection] = useState<'left' | 'right'>('right');
  const prevCategoryRef = useRef<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory && prevCategoryRef.current) {
      // Determine animation direction by comparing category indices
      const prevIndex = categories.findIndex(c => c.id === prevCategoryRef.current);
      const currentIndex = categories.findIndex(c => c.id === selectedCategory.id);
      
      if (prevIndex !== -1 && currentIndex !== -1) {
        setAnimateDirection(currentIndex > prevIndex ? 'right' : 'left');
      }
    }
    
    if (selectedCategory) {
      prevCategoryRef.current = selectedCategory.id;
    }
  }, [selectedCategory, categories]);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory?.id === category.id) {
      onSelectCategory?.(null); // Unselect if already selected
    } else {
      onSelectCategory?.(category);
    }
  };

  const handleSearchClick = (subcategoryId: string) => {
    // Navigate to search page with category and subcategory parameters
    const categoryId = selectedCategory?.id;
    if (categoryId) {
      navigate(`/search?category=${categoryId}&subcategory=${subcategoryId}&transport=${transportMode}&distance=${maxDistance}&unit=${distanceUnit}`);
      
      toast({
        title: "Recherche lancée",
        description: `Recherche de lieux pour ${selectedCategory?.name} - ${subcategoryId}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {categories.map((category) => (
          <CategoryCard3D
            key={category.id}
            category={category}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        {selectedCategory && (
          <motion.div
            key={selectedCategory.id}
            initial={{ 
              opacity: 0, 
              x: animateDirection === 'right' ? 50 : -50,
              y: 10 
            }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: 0 
            }}
            exit={{ 
              opacity: 0,
              x: animateDirection === 'right' ? -50 : 50,
              y: 10 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="mt-6"
          >
            <div className="flex items-center mb-6 space-x-3">
              <div className="text-2xl md:text-3xl p-2 rounded-full" style={{ backgroundColor: selectedCategory.color + '20' }}>
                {React.createElement(selectedCategory.icon as React.ComponentType<any>, { 
                  size: 30,
                  color: selectedCategory.color,
                  strokeWidth: 2
                })}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: selectedCategory.color }}>
                  {selectedCategory.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  Sélectionnez une sous-catégorie pour commencer votre recherche
                </p>
              </div>
            </div>
            
            <SubcategoriesList 
              category={selectedCategory}
              dailyAddresses={dailyAddresses}
              onEditAddress={onEditAddress}
              onDeleteAddress={onDeleteAddress}
              onAddNewAddress={onAddNewAddress}
              onSearchClick={handleSearchClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySection;
