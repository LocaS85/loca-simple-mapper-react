
import React from 'react';
import { motion } from 'framer-motion';
import { DailyAddressData } from '@/types';

interface SubcategoryCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  addressCount: number;
  addresses: DailyAddressData[];
  onEditAddress: (address: DailyAddressData) => void;
  onDeleteAddress: (addressId: string) => void;
  onAddNewAddress: () => void;
  onSearchClick: () => void;
}

const SubcategoryCard3D: React.FC<SubcategoryCardProps> = ({ 
  title,
  icon,
  color,
  description,
  addressCount,
  addresses,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress,
  onSearchClick
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
      style={{ borderColor: color }}
    >
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full mb-3" style={{ backgroundColor: color + '15' }}>
          {icon}
        </div>
        <h3 className="font-medium text-lg mb-1 text-center">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 text-center">{description}</p>
        )}
      </div>
      
      {addressCount > 0 && (
        <div className="mt-3 w-full">
          <p className="text-xs font-medium text-gray-600 mb-2">
            {addressCount} adresse{addressCount > 1 ? 's' : ''} enregistrée{addressCount > 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            {addresses.slice(0, 2).map(address => (
              <div key={address.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                <span className="truncate flex-1">{address.name}</span>
                <button 
                  onClick={() => onEditAddress(address)} 
                  className="text-blue-500 hover:text-blue-700 px-1"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDeleteAddress(address.id)} 
                  className="text-red-500 hover:text-red-700 px-1"
                >
                  🗑️
                </button>
              </div>
            ))}
            {addressCount > 2 && (
              <div className="text-xs text-center text-gray-500">
                +{addressCount - 2} autres
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-auto pt-3 flex flex-col w-full gap-2">
        <button 
          onClick={onAddNewAddress}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full w-full transition-colors"
        >
          Ajouter une adresse
        </button>
        <button 
          onClick={onSearchClick}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs py-1 px-2 rounded-full w-full transition-colors"
        >
          Rechercher à proximité
        </button>
      </div>
    </motion.div>
  );
};

export default SubcategoryCard3D;
