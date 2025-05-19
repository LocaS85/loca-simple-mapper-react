
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadAddresses, saveAddresses, createOrUpdateAddress } from '@/services/addressService';
import { DailyAddressData } from '@/types';

export function useAddressManagement() {
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressData[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressData | null>(null);
  const { toast } = useToast();
  
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

  const handleSaveAddress = (addressData: any) => {
    const result = createOrUpdateAddress(addressData, editingAddress, dailyAddresses);
    
    if (result.success) {
      setDailyAddresses(result.addresses);
      setShowAddressForm(false);
      setEditingAddress(null);
    }
    
    toast(result.message);
  };

  const handleEditAddress = (address: any) => {
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
