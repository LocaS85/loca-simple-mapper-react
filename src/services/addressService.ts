
import { DailyAddressItem } from '@/types/unified';

export const loadAddresses = (): DailyAddressItem[] => {
  try {
    const stored = localStorage.getItem('dailyAddresses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading addresses:', error);
    return [];
  }
};

export const saveAddresses = (addresses: DailyAddressItem[]) => {
  try {
    localStorage.setItem('dailyAddresses', JSON.stringify(addresses));
  } catch (error) {
    console.error('Error saving addresses:', error);
  }
};

export const createOrUpdateAddress = (
  addressData: DailyAddressItem,
  editingAddress: DailyAddressItem | null,
  currentAddresses: DailyAddressItem[]
) => {
  try {
    let updatedAddresses: DailyAddressItem[];
    
    if (editingAddress) {
      // Update existing address
      updatedAddresses = currentAddresses.map(addr => 
        addr.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : addr
      );
    } else {
      // Add new address
      const newAddress: DailyAddressItem = {
        ...addressData,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        isDaily: true
      };
      updatedAddresses = [...currentAddresses, newAddress];
    }

    return {
      success: true,
      addresses: updatedAddresses,
      message: {
        title: editingAddress ? "Adresse modifiée" : "Adresse ajoutée",
        description: editingAddress ? "L'adresse a été mise à jour" : "Nouvelle adresse ajoutée avec succès"
      }
    };
  } catch (error) {
    return {
      success: false,
      addresses: currentAddresses,
      message: {
        title: "Erreur",
        description: "Impossible de sauvegarder l'adresse",
        variant: "destructive" as const
      }
    };
  }
};
