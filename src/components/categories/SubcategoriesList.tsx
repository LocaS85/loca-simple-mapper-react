
import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import SubcategoryCard3D from '@/components/categories/SubcategoryCard3D';
import DailyAddressSection from '@/components/categories/DailyAddressSection';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SubcategoriesListProps {
  category: Category;
  dailyAddresses: any[];
  onEditAddress: (address: any) => void;
  onDeleteAddress: (addressId: string) => void;
  onAddNewAddress: (subcategoryId: string) => void;
  onSearchClick: (subcategoryId: string) => void;
}

const SubcategoriesList: React.FC<SubcategoriesListProps> = ({
  category,
  dailyAddresses,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress,
  onSearchClick
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {category.subcategories.map((subcategory) => (
        <motion.div key={subcategory.id} variants={item} className="flex flex-col">
          <SubcategoryCard3D 
            subcategory={subcategory}
            parentCategoryId={category.id}
            parentCategoryColor={category.color}
          />
          
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSearchClick(subcategory.id)}
              className="flex items-center gap-1 border border-gray-300 hover:border-gray-400"
            >
              <Search size={14} />
              <span>Rechercher</span>
            </Button>
          </div>
          
          {/* For Daily category, show saved addresses */}
          {category.id === 'quotidien' && (
            <DailyAddressSection
              subcategoryId={subcategory.id}
              addresses={dailyAddresses.filter(addr => addr.subcategory === subcategory.id)}
              onEditAddress={onEditAddress}
              onDeleteAddress={onDeleteAddress}
              onAddNewAddress={() => onAddNewAddress(subcategory.id)}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubcategoriesList;
