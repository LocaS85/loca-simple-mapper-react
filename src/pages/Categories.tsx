
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import AddressManagementCard from '@/components/categories/AddressManagementCard';
import StandardCategoryCard from '@/components/categories/StandardCategoryCard';
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestion des Catégories</h1>
        <p className="text-gray-600">
          Gérez vos adresses personnelles et explorez les catégories de lieux
        </p>
      </div>

      {/* Section des catégories spéciales (gestion d'adresses) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Mes Adresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialCategories.map((category) => (
            <AddressManagementCard
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
        <h2 className="text-2xl font-semibold mb-4">Configuration Transport</h2>
        <TransportModeManager
          transportModes={transportModes}
          onUpdateColor={handleUpdateTransportColor}
        />
      </section>

      {/* Section des catégories standards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Catégories de Recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardCategories.map((category) => (
            <StandardCategoryCard
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
