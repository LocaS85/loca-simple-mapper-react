
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadAddresses, saveAddresses, createOrUpdateAddress } from '@/services/addressService';
import { DailyAddressData, DailyAddressItem } from '@/types/category';

export function useAddressManagement() {
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressData[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressData | null>(null);
  const { toast } = useToast();
  
  // Load addresses from localStorage
  useEffect(() => {
    try {
      const addresses = loadAddresses();
      // Convert DailyAddressItem[] to DailyAddressData[]
      const convertedAddresses: DailyAddressData[] = addresses.map(addr => ({
        id: addr.id,
        name: addr.name,
        address: addr.address,
        coordinates: addr.coordinates,
        category: addr.category,
        subcategory: addr.subcategory,
        transportMode: addr.transportMode,
        date: addr.date,
        isDaily: addr.isDaily
      }));
      setDailyAddresses(convertedAddresses);
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
    // Convert DailyAddressData[] to DailyAddressItem[]
    const convertedAddresses: DailyAddressItem[] = dailyAddresses.map(addr => ({
      id: addr.id,
      name: addr.name,
      address: addr.address,
      coordinates: addr.coordinates,
      category: addr.category,
      subcategory: addr.subcategory,
      date: addr.date || new Date().toISOString(),
      isDaily: addr.isDaily || false,
      transportMode: addr.transportMode
    }));
    saveAddresses(convertedAddresses);
  }, [dailyAddresses]);

  const handleSaveAddress = (addressData: any) => {
    // Convert to DailyAddressItem for service call
    const addressItem: DailyAddressItem = {
      ...addressData,
      date: addressData.date || new Date().toISOString(),
      isDaily: addressData.isDaily || false
    };
    
    const editingItem = editingAddress ? {
      ...editingAddress,
      date: editingAddress.date || new Date().toISOString(),
      isDaily: editingAddress.isDaily || false
    } : null;

    const currentItems: DailyAddressItem[] = dailyAddresses.map(addr => ({
      id: addr.id,
      name: addr.name,
      address: addr.address,
      coordinates: addr.coordinates,
      category: addr.category,
      subcategory: addr.subcategory,
      date: addr.date || new Date().toISOString(),
      isDaily: addr.isDaily || false,
      transportMode: addr.transportMode
    }));

    const result = createOrUpdateAddress(addressItem, editingItem, currentItems);
    
    if (result.success) {
      // Convert back to DailyAddressData[]
      const convertedAddresses: DailyAddressData[] = result.addresses.map(addr => ({
        id: addr.id,
        name: addr.name,
        address: addr.address,
        coordinates: addr.coordinates,
        category: addr.category,
        subcategory: addr.subcategory,
        transportMode: addr.transportMode,
        date: addr.date,
        isDaily: addr.isDaily
      }));
      setDailyAddresses(convertedAddresses);
      setShowAddressForm(false);
      setEditingAddress(null);
    }
    
    toast(result.message);
  };

  const handleEditAddress = (address: DailyAddressData) => {
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

  return {
    dailyAddresses,
    showAddressForm,
    setShowAddressForm,
    editingAddress,
    setEditingAddress,
    handleSaveAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleAddNewAddress
  };
}
