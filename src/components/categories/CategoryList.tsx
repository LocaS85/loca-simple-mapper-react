
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CategoryCard3D from '@/components/CategoryCard3D';
import SubcategoryCard3D from '@/components/SubcategoryCard3D';
import { CategoryItem, SubcategoryItem } from '@/types/category';
import DailyAddressSection from './DailyAddressSection';

interface CategoryListProps {
  categories: CategoryItem[];
  dailyAddresses: any[];
  onEditAddress: (address: any) => void;
  onDeleteAddress: (addressId: string) => void;
  onAddNewAddress: (subcategoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  dailyAddresses,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <CategoryCard3D
            key={category.id}
            category={category}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <div className="flex items-center mb-4 space-x-3">
              <span className="text-2xl">{selectedCategory.icon}</span>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: selectedCategory.color }}>
                {selectedCategory.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {selectedCategory.subcategories?.map((subcategory) => {
                // Convertir en SubcategoryItem avec les propriétés manquantes
                const subcategoryItem: SubcategoryItem = {
                  id: subcategory.id,
                  name: subcategory.name,
                  description: subcategory.description,
                  icon: '📍', // Icône par défaut
                  parentId: selectedCategory.id
                };

                return (
                  <div key={subcategory.id} className="flex flex-col">
                    <SubcategoryCard3D 
                      subcategory={subcategoryItem}
                      parentCategoryId={selectedCategory.id}
                      parentCategoryColor={selectedCategory.color}
                    />
                    
                    {/* For Daily category, show saved addresses */}
                    {selectedCategory.id === 'quotidien' && (
                      <DailyAddressSection
                        subcategoryId={subcategory.id}
                        addresses={dailyAddresses.filter(addr => addr.subcategory === subcategory.id)}
                        onEditAddress={onEditAddress}
                        onDeleteAddress={onDeleteAddress}
                        onAddNewAddress={() => onAddNewAddress(subcategory.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryList;
