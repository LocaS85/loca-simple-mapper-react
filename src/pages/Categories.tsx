
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMapboxTokenValidSync } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import ModernAddressCard from '@/components/categories/ModernAddressCard';
import ModernCategoryCard from '@/components/categories/ModernCategoryCard';
import ModernTransportManager from '@/components/categories/ModernTransportManager';
import CustomAddressCard from '@/components/categories/CustomAddressCard';
import CategoryScrollManager from '@/components/categories/CategoryScrollManager';
import CategoryDetailModal from '@/components/categories/CategoryDetailModal';
import RouteBackButton from '@/components/ui/RouteBackButton';
import Logo from '@/components/ui/Logo';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useHorizontalScroll({ sensitivity: 0.5, momentum: true });
  
  // Use Supabase categories hook
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

  // Handle address operations with toast notifications
  const handleAddAddress = async (address: any) => {
    try {
      await addUserAddress(address);
      toast({
        title: "Adresse ajoutée",
        description: "L'adresse a été ajoutée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'adresse.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAddress = async (id: string, updates: any) => {
    try {
      await updateUserAddress(id, updates);
      toast({
        title: "Adresse modifiée",
        description: "L'adresse a été modifiée avec succès.",
      });
    } catch (error) {
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
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la couleur.",
        variant: "destructive",
      });
    }
  };
  
  // Check if Mapbox token is valid
  if (!isMapboxTokenValidSync()) {
    return <MapboxError />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8 text-red-600">
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  // Séparer les catégories spéciales et standards
  const specialCategories = categories.filter(cat => cat.category_type === 'special');
  const standardCategories = categories.filter(cat => cat.category_type === 'standard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6 md:space-y-8 max-w-7xl">
        {/* Header avec bouton retour */}
        <motion.div 
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <RouteBackButton 
              route="/"
              showLabel={true}
              variant="ghost"
            />
            <Logo size="md" variant="primary" showText={true} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gestion des Catégories
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Gérez vos adresses personnelles et explorez les catégories de lieux avec une interface moderne et intuitive
            </p>
          </div>
        </motion.div>

      {/* Section des catégories spéciales (gestion d'adresses) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm">📍</span>
          </motion.div>
          Mes Adresses
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {specialCategories.map((category) => (
            <ModernAddressCard
              key={category.id}
              category={category as any}
              addresses={userAddresses}
              onAddAddress={handleAddAddress}
              onUpdateAddress={handleUpdateAddress}
              onDeleteAddress={handleDeleteAddress}
              maxAddresses={10}
            />
          ))}
          
          {/* Section Autre - Catégories personnalisables */}
          <CustomAddressCard
            addresses={userAddresses}
            onAddAddress={handleAddAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
            maxAddresses={15}
          />
        </div>
      </motion.section>

      {/* Section des modes de transport */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm">🚗</span>
          </motion.div>
          Configuration Transport
        </h2>
        <ModernTransportManager
          transportModes={transportModes}
          onUpdateColor={handleUpdateTransportColor}
        />
      </motion.section>

      {/* Section des catégories standards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm">🔍</span>
          </motion.div>
          Catégories de Recherche
        </h2>
        <div className="relative">
          {/* Smart scroll management */}
          <CategoryScrollManager 
            containerId="categories-scroll-container"
            itemCount={standardCategories.length}
            itemWidth={320}
          />
          
          {/* Horizontal scrolling container */}
          <div 
            ref={scrollRef}
            id="categories-scroll-container"
            className="flex overflow-x-auto gap-4 md:gap-6 pb-4 px-2 md:px-12 scroll-smooth scrollbar-hide scroll-touch scroll-snap-x"
          >
            <div className="flex gap-4 md:gap-6 min-w-max">
              {standardCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="flex-shrink-0 w-80 md:w-96 scroll-snap-center"
                >
                  <ModernCategoryCard
                    category={category}
                    subcategories={category.subcategories || []}
                    transportMode="walking"
                    maxDistance={5}
                    distanceUnit="km"
                    aroundMeCount={3}
                    onDetailClick={() => {
                      setSelectedCategory(category);
                      setIsModalOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex gap-2">
              {standardCategories.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
                  id={`indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      
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
    </div>
  );
};

export default Categories;
