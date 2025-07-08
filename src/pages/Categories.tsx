
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import ModernAddressCard from '@/components/categories/ModernAddressCard';
import ModernCategoryCard from '@/components/categories/ModernCategoryCard';
import TransportModeManager from '@/components/categories/TransportModeManager';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  if (!isMapboxTokenValid()) {
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
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Gestion des Catégories
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gérez vos adresses personnelles et explorez les catégories de lieux avec une interface moderne et intuitive
        </p>
      </div>

      {/* Section des catégories spéciales (gestion d'adresses) */}
      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm">📍</span>
          </div>
          Mes Adresses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </section>

      {/* Section des modes de transport */}
      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-white text-sm">🚗</span>
          </div>
          Configuration Transport
        </h2>
        <TransportModeManager
          transportModes={transportModes}
          onUpdateColor={handleUpdateTransportColor}
        />
      </section>

      {/* Section des catégories standards */}
      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm">🔍</span>
          </div>
          Catégories de Recherche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardCategories.map((category) => (
            <ModernCategoryCard
              key={category.id}
              category={category}
              subcategories={category.subcategories || []}
              transportMode="walking"
              maxDistance={5}
              distanceUnit="km"
              aroundMeCount={3}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Categories;
