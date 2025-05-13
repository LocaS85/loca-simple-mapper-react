
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
  // États
  const [showMap, setShowMap] = useState(false);
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedCategories, setConvertedCategories] = useState<CategoryItem[]>([]);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Convertir les catégories au premier rendu
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

  // Charger les adresses depuis le localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('dailyAddresses');
    if (savedAddresses) {
      try {
        setDailyAddresses(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('Erreur de parsing des adresses:', error);
        toast({
          title: "Erreur de données",
          description: "Impossible de charger les adresses sauvegardées",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Sauvegarder les adresses dans le localStorage
  useEffect(() => {
    if (dailyAddresses.length > 0) {
      localStorage.setItem('dailyAddresses', JSON.stringify(dailyAddresses));
    }
  }, [dailyAddresses]);

  // Gestionnaires d'événements
  const handleFiltersChange = (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => {
    console.log("Filtres reçus:", filters);
  };

  const handleSaveAddress = (addressData: Partial<DailyAddressItem>) => {
    const newAddress = {
      ...addressData,
      id: editingAddress?.id || `addr_${Date.now()}`,
      coordinates: addressData.coordinates || [0, 0] as [number, number],
      category: 'quotidien',
      subcategory: addressData.subcategory || 'autre',
    } as DailyAddressItem;

    if (editingAddress) {
      // Modification d'une adresse existante
      setDailyAddresses(prev => 
        prev.map(addr => addr.id === editingAddress.id ? newAddress : addr)
      );
      toast({
        title: "Adresse modifiée",
        description: `L'adresse "${newAddress.name}" a été mise à jour`
      });
    } else {
      // Ajout d'une nouvelle adresse
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
  
  // Vérifier si le token Mapbox est disponible
  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête avec bascule entre vue liste et carte */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Catégories</h1>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setShowMap(false)}
            className={`py-2 px-4 rounded-md transition-all ${
              !showMap 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'hover:bg-gray-200'
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`py-2 px-4 rounded-md transition-all ${
              showMap 
                ? 'bg-white shadow text-blue-600 font-medium' 
                : 'hover:bg-gray-200'
            }`}
          >
            Carte
          </button>
        </div>
      </div>
      
      {/* Indicateur de chargement */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Contenu principal - Carte ou Liste */}
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
      
      {/* Modal de formulaire d'adresse */}
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="sm:max-w-[500px]">
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
