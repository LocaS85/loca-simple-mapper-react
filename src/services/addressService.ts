
import { DailyAddressItem } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

export const loadAddresses = (): DailyAddressItem[] => {
  const savedAddresses = localStorage.getItem('dailyAddresses');
  if (savedAddresses) {
    try {
      return JSON.parse(savedAddresses);
    } catch (error) {
      console.error('Erreur de parsing des adresses:', error);
      return [];
    }
  }
  return [];
};

export const saveAddresses = (addresses: DailyAddressItem[]): void => {
  if (addresses.length > 0) {
    localStorage.setItem('dailyAddresses', JSON.stringify(addresses));
  }
};

export const createOrUpdateAddress = (
  addressData: Partial<DailyAddressItem>,
  editingAddress: DailyAddressItem | null,
  existingAddresses: DailyAddressItem[]
): {
  addresses: DailyAddressItem[];
  success: boolean;
  message: { title: string; description: string; variant?: "default" | "destructive" };
} => {
  const newAddress = {
    ...addressData,
    id: editingAddress?.id || `addr_${Date.now()}`,
    coordinates: addressData.coordinates || [0, 0] as [number, number],
    category: 'quotidien',
    subcategory: addressData.subcategory || 'autre',
  } as DailyAddressItem;

  if (editingAddress) {
    // Modification d'une adresse existante
    return {
      addresses: existingAddresses.map(addr => addr.id === editingAddress.id ? newAddress : addr),
      success: true,
      message: {
        title: "Adresse modifiée",
        description: `L'adresse "${newAddress.name}" a été mise à jour`
      }
    };
  } else {
    // Ajout d'une nouvelle adresse
    if (existingAddresses.length >= 10) {
      return {
        addresses: existingAddresses,
        success: false,
        message: {
          title: "Limite atteinte",
          description: "Vous ne pouvez pas enregistrer plus de 10 adresses",
          variant: "destructive"
        }
      };
    }
    return {
      addresses: [...existingAddresses, newAddress],
      success: true,
      message: {
        title: "Adresse ajoutée",
        description: `L'adresse "${newAddress.name}" a été enregistrée`
      }
    };
  }
};
