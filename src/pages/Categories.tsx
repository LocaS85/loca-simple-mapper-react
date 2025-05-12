
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { categoriesData } from '../data/categories';
import { CategoryItem, DailyAddressItem } from '../types/category';
import CategoryCard3D from '@/components/CategoryCard3D';
import SubcategoryCard3D from '@/components/SubcategoryCard3D';
import DailyAddressForm from '@/components/DailyAddressForm';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressItem | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load saved daily addresses from local storage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('dailyAddresses');
    if (savedAddresses) {
      try {
        setDailyAddresses(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('Error parsing saved addresses:', error);
      }
    }
  }, []);

  // Save daily addresses to local storage when updated
  useEffect(() => {
    if (dailyAddresses.length > 0) {
      localStorage.setItem('dailyAddresses', JSON.stringify(dailyAddresses));
    }
  }, [dailyAddresses]);

  const handleSaveAddress = (addressData: Partial<DailyAddressItem>) => {
    const newAddress = {
      ...addressData,
      id: editingAddress?.id || `addr_${Date.now()}`,
      coordinates: [0, 0] as [number, number], // Placeholder, real coordinates would come from geocoding API
      category: 'quotidien',
      subcategory: addressData.subcategory || 'autre',
    } as DailyAddressItem;

    if (editingAddress) {
      // Edit existing address
      setDailyAddresses(prev => 
        prev.map(addr => addr.id === editingAddress.id ? newAddress : addr)
      );
      toast({
        title: "Adresse modifiée",
        description: `L'adresse "${newAddress.name}" a été mise à jour`
      });
    } else {
      // Add new address
      if (dailyAddresses.length >= 10) {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez pas enregistrer plus de 10 adresses",
          variant: "destructive"
        });
        return;
      }
      setDailyAddresses(prev => [...prev, newAddress]);
      toast({
        title: "Adresse ajoutée",
        description: `L'adresse "${newAddress.name}" a été enregistrée`
      });
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: DailyAddressItem) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setDailyAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Adresse supprimée",
      description: "L'adresse a été supprimée avec succès"
    });
  };

  const handleAddNewAddress = (subcategoryId: string) => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const renderDailyAddresses = (subcategoryId: string) => {
    const filteredAddresses = dailyAddresses.filter(addr => addr.subcategory === subcategoryId);
    
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Adresses enregistrées</h3>
          {filteredAddresses.length < 10 && (
            <button
              onClick={() => handleAddNewAddress(subcategoryId)}
              className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter
            </button>
          )}
        </div>
        
        {filteredAddresses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune adresse enregistrée dans cette catégorie</p>
        ) : (
          <div className="space-y-3">
            {filteredAddresses.map(address => (
              <div key={address.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{address.name}</h4>
                  <p className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-[400px]">
                    {address.address}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditAddress(address)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l9.38-9.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Catégories</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categoriesData.map((category) => (
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
              {selectedCategory.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex flex-col">
                  <SubcategoryCard3D 
                    subcategory={subcategory}
                    parentCategoryId={selectedCategory.id}
                    parentCategoryColor={selectedCategory.color}
                  />
                  
                  {/* For Daily category, show saved addresses */}
                  {selectedCategory.id === 'quotidien' && renderDailyAddresses(subcategory.id)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Address form dialog */}
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une nouvelle adresse'}
            </DialogTitle>
          </DialogHeader>
          <DailyAddressForm 
            onSave={handleSaveAddress}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            initialData={editingAddress || {}}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
