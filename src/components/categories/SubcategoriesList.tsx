
import React from 'react';
import { Clock } from 'lucide-react';
import SubcategoryCard3D from './SubcategoryCard3D';
import { Category, DailyAddressData } from '@/types';

interface SubcategoriesListProps {
  category: Category;
  dailyAddresses: DailyAddressData[];
  onEditAddress: (address: DailyAddressData) => void;
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
  // Filter addresses that belong to the current category
  const categoryAddresses = dailyAddresses.filter(address => address.category === category.id);
  
  // Count addresses per subcategory
  const subcategoryAddressCounts: {[key: string]: number} = {};
  categoryAddresses.forEach(address => {
    if (subcategoryAddressCounts[address.subcategory]) {
      subcategoryAddressCounts[address.subcategory]++;
    } else {
      subcategoryAddressCounts[address.subcategory] = 1;
    }
  });
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {category.subcategories.map((subcategory) => {
        const addressCount = subcategoryAddressCounts[subcategory.id] || 0;
        const subcategoryAddresses = categoryAddresses.filter(
          address => address.subcategory === subcategory.id
        );
        
        // Fix: Create icon element with proper typing
        const IconComponent = subcategory.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
        const iconElement = <IconComponent color={category.color} strokeWidth={2} />;
        
        return (
          <SubcategoryCard3D
            key={subcategory.id}
            title={subcategory.name}
            icon={iconElement}
            color={category.color}
            description={subcategory.description || ''}
            addressCount={addressCount}
            addresses={subcategoryAddresses}
            onEditAddress={onEditAddress}
            onDeleteAddress={onDeleteAddress}
            onAddNewAddress={() => onAddNewAddress(subcategory.id)}
            onSearchClick={() => onSearchClick(subcategory.id)}
          />
        );
      })}
    </div>
  );
};

export default SubcategoriesList;
