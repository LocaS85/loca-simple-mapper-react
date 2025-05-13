
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { categoriesData } from '../data/categories';
import { CategoryItem, DailyAddressItem } from '../types/category';
import DailyAddressForm from '@/components/DailyAddressForm';
import { useToast } from '@/hooks/use-toast';
import { convertCategories } from '@/utils/categoryConverter';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import CategoryList from '@/components/categories/CategoryList';
import CategoryMapView from '@/components/map/CategoryMapView';
import { TransportMode } from '@/lib/data/transportModes';

const Categories = () => {
  const [showMap, setShowMap] = useState(false);
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressItem | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Convert categories once on component mount
  const [convertedCategories, setConvertedCategories] = useState<CategoryItem[]>([]);
  
  useEffect(() => {
    setConvertedCategories(convertCategories(categoriesData));
  }, []);

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

  const handleFiltersChange = (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => {
    // Handle map filter changes at the parent level if needed
    console.log("Parent received filters:", filters);
  };

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
  
  // Check if Mapbox token is available
  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Catégories</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(false)}
            className={`py-2 px-4 rounded ${!showMap ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Liste
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`py-2 px-4 rounded ${showMap ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Carte
          </button>
        </div>
      </div>
      
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
