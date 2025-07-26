import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// UI Components
import { Button } from '@/components/ui/button';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import RouteBackButton from '@/components/ui/RouteBackButton';
import Footer from '@/components/Footer';

// Category Components
import AddressSectionManager from '@/components/categories/AddressSectionManager';
import SearchCategoriesSection from '@/components/categories/SearchCategoriesSection';
import CategoryDetailModal from '@/components/categories/CategoryDetailModal';

// MapBox Integration
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';

// Types
import { UserAddress } from '@/hooks/useSupabaseCategories';

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Modal state
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data fetching
  const {
    categories,
    userAddresses,
    transportModes,
    loading,
    error,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    updateTransportColor
  } = useSupabaseCategories();

  // Separate categories by type
  const specialCategories = categories.filter(cat => cat.category_type === 'special');
  const standardCategories = categories.filter(cat => cat.category_type === 'standard');

  // Address management handlers
  const handleAddAddress = async (address: Omit<UserAddress, 'id' | 'user_id'>) => {
    try {
      await addUserAddress(address);
      toast({
        title: "Adresse ajoutée",
        description: "L'adresse a été ajoutée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'adresse.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAddress = async (id: string, updates: Partial<UserAddress>) => {
    try {
      await updateUserAddress(id, updates);
      toast({
        title: "Adresse modifiée",
        description: "L'adresse a été modifiée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la modification de l\'adresse:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'adresse.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteUserAddress(id);
      toast({
        title: "Adresse supprimée",
        description: "L'adresse a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'adresse.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTransportColor = async (transportModeId: string, color: string) => {
    try {
      await updateTransportColor(transportModeId, color);
      toast({
        title: "Couleur mise à jour",
        description: "La couleur du mode de transport a été mise à jour.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la couleur.",
        variant: "destructive",
      });
    }
  };

  const handleCategoryDetailClick = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Check Mapbox token
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || localStorage.getItem('mapbox_token');
  if (!mapboxToken) {
    return <MapboxTokenWarning />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedLoadingSpinner />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Réessayer
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <RouteBackButton 
              route="/"
              showLabel={true}
              variant="ghost"
            />
            <div></div>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              Réglages
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Mes Catégories
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Gérez vos adresses personnelles et explorez les catégories de recherche
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Address Management Sections */}
          <AddressSectionManager
            specialCategories={specialCategories}
            userAddresses={userAddresses}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
          />

          {/* Search Categories Section */}
          <SearchCategoriesSection
            standardCategories={standardCategories}
            onCategoryDetailClick={handleCategoryDetailClick}
          />
        </div>
      
        {/* Category Detail Modal */}
        <CategoryDetailModal
          category={selectedCategory}
          subcategories={selectedCategory?.subcategories || []}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          transportMode="walking"
          maxDistance={5}
          distanceUnit="km"
        />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Categories;