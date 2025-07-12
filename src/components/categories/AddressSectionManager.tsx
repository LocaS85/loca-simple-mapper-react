import React from 'react';
import { motion } from 'framer-motion';
import ModernAddressCard from './ModernAddressCard';
import CustomAddressCard from './CustomAddressCard';
import { UserAddress } from '@/hooks/useSupabaseCategories';

interface AddressSectionManagerProps {
  specialCategories: Array<{
    id: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    category_type: string;
  }>;
  userAddresses: UserAddress[];
  onAddAddress: (address: Omit<UserAddress, 'id' | 'user_id'>) => Promise<void>;
  onUpdateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
}

const AddressSectionManager: React.FC<AddressSectionManagerProps> = ({
  specialCategories,
  userAddresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  return (
    <>
      {/* Section Mes Adresses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm">📍</span>
          </motion.div>
          Mes Adresses
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {specialCategories.map((category) => (
            <ModernAddressCard
              key={category.id}
              category={category as any}
              addresses={userAddresses}
              onAddAddress={onAddAddress}
              onUpdateAddress={onUpdateAddress}
              onDeleteAddress={onDeleteAddress}
              maxAddresses={10}
            />
          ))}
          
          {/* Section Autre - Catégories personnalisables */}
          <CustomAddressCard
            addresses={userAddresses}
            onAddAddress={onAddAddress}
            onUpdateAddress={onUpdateAddress}
            onDeleteAddress={onDeleteAddress}
            maxAddresses={15}
          />
        </div>
      </motion.section>

      {/* Section "Autre" pour catégories personnalisées */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm">➕</span>
          </motion.div>
          Autre
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl"
        >
          <p className="text-lg font-medium mb-2">Catégories personnalisées</p>
          <p className="text-sm">
            Les catégories personnalisées seront ajoutées dans une future mise à jour
          </p>
        </motion.div>
      </motion.section>
    </>
  );
};

export default AddressSectionManager;