
import React, { useState, useEffect } from 'react';
import { categoriesData } from '../data/categories';
import { CategoryItem, DailyAddressItem } from '../types/category';
import { useToast } from '@/hooks/use-toast';
import { convertCategories } from '@/utils/categoryConverter';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { TransportMode } from '@/lib/data/transportModes';
import { 
  CategoryList, 
  CategoryMapView, 
  MapToggle, 
  AddressFormDialog 
} from '@/components/categories';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { loadAddresses, saveAddresses, createOrUpdateAddress } from '@/services/addressService';

const Categories = () => {
  // States
  const [showMap, setShowMap] = useState(false);
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedCategories, setConvertedCategories] = useState<CategoryItem[]>([]);
  
  const { toast } = useToast();
  
  // Load and convert categories on initial render
  useEffect(() => {
    try {
      setIsLoading(true);
      setConvertedCategories(convertCategories(categoriesData));
    } catch (error) {
      console.error("Erreur lors de la conversion des catégories:", error);
      toast({
        title: "Erreur de données",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load addresses from localStorage
  useEffect(() => {
    try {
      const addresses = loadAddresses();
      setDailyAddresses(addresses);
    } catch (error) {
      console.error('Erreur de chargement des adresses:', error);
      toast({
        title: "Erreur de données",
        description: "Impossible de charger les adresses sauvegardées",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Save addresses to localStorage when they change
  useEffect(() => {
    saveAddresses(dailyAddresses);
  }, [dailyAddresses]);

  // Event handlers
  const handleFiltersChange = (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => {
    console.log("Filtres reçus:", filters);
  };

  const handleSaveAddress = (addressData: Partial<DailyAddressItem>) => {
    const result = createOrUpdateAddress(addressData, editingAddress, dailyAddresses);
    
    if (result.success) {
      setDailyAddresses(result.addresses);
      setShowAddressForm(false);
      setEditingAddress(null);
    }
    
    toast(result.message);
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
  
  // Check if Mapbox token is valid
  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with list/map toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Catégories</h1>
        <MapToggle showMap={showMap} setShowMap={setShowMap} />
      </div>
      
      {/* Loading indicator */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Main content - Map or List */}
          {showMap ? (
            <CategoryMapView onFiltersChange={handleFiltersChange} />
          ) : (
            <CategoryList 
              categories={convertedCategories}
              dailyAddresses={dailyAddresses}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onAddNewAddress={handleAddNewAddress}
            />
          )}
        </>
      )}
      
      {/* Address form dialog */}
      <AddressFormDialog 
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
        editingAddress={editingAddress}
        setEditingAddress={setEditingAddress}
        onSaveAddress={handleSaveAddress}
      />
    </div>
  );
};

export default Categories;
