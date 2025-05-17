
import React, { useState, useEffect } from 'react';
import { fullCategoriesData } from '../data/fullCategories';
import { CategoryItem, DailyAddressItem } from '../types/category';
import { useToast } from '@/hooks/use-toast';
import { convertCategories } from '@/utils/categoryConverter';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { TransportMode } from '@/lib/data/transportModes';
import { 
  MapToggle,
  AddressFormDialog,
  CategoryMapView
} from '@/components/categories';
import CategorySection from '@/components/categories/CategorySection';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { loadAddresses, saveAddresses, createOrUpdateAddress } from '@/services/addressService';
import { Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const Categories = () => {
  // States
  const [showMap, setShowMap] = useState(false);
  const [dailyAddresses, setDailyAddresses] = useState<DailyAddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DailyAddressItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [convertedCategories, setConvertedCategories] = useState<Category[]>([]);
  const [transportMode, setTransportMode] = useState<TransportMode>("walking");
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxDuration, setMaxDuration] = useState(20);
  
  const { toast } = useToast();
  
  // Load and convert categories on initial render
  useEffect(() => {
    try {
      setIsLoading(true);
      setConvertedCategories(convertCategories(fullCategoriesData));
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
    setTransportMode(filters.transportMode);
    setMaxDistance(filters.maxDistance);
    setMaxDuration(filters.maxDuration);
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
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Tabs 
              defaultValue="distance" 
              className="w-[250px]"
              onValueChange={(value) => console.log("Tab changed:", value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="distance">Distance</TabsTrigger>
                <TabsTrigger value="duration">Durée</TabsTrigger>
              </TabsList>
              <TabsContent value="distance" className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Max:</span>
                  <div className="flex items-center gap-2">
                    <Slider
                      className="w-32"
                      value={[maxDistance]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(values) => setMaxDistance(values[0])}
                    />
                    <span className="text-sm font-medium min-w-[40px] text-right">{maxDistance} km</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="duration" className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Max:</span>
                  <div className="flex items-center gap-2">
                    <Slider
                      className="w-32"
                      value={[maxDuration]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={(values) => setMaxDuration(values[0])}
                    />
                    <span className="text-sm font-medium min-w-[40px] text-right">{maxDuration} min</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <MapToggle showMap={showMap} setShowMap={setShowMap} />
        </div>
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
            <CategorySection 
              categories={convertedCategories}
              dailyAddresses={dailyAddresses}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onAddNewAddress={handleAddNewAddress}
              transportMode={transportMode}
              maxDistance={maxDistance}
              maxDuration={maxDuration}
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
