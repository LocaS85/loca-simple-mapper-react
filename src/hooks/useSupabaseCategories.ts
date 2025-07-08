import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category_type: 'standard' | 'special';
  sort_order: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  icon: string;
  search_terms: string[];
  sort_order: number;
}

export interface UserAddress {
  id: string;
  user_id: string;
  category_type: 'main' | 'family' | 'work' | 'school';
  name: string;
  address: string;
  coordinates: [number, number];
  role?: string;
  company_name?: string;
  is_primary: boolean;
}

export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  default_color: string;
  mapbox_profile: string;
  sort_order: number;
  custom_color?: string;
}

export const useSupabaseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les catégories avec sous-catégories
  const loadCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('sort_order');

      if (subcategoriesError) throw subcategoriesError;

      // Grouper les sous-catégories par catégorie
      const categoriesWithSubs: Category[] = categoriesData.map(category => ({
        ...category,
        category_type: category.category_type as 'standard' | 'special',
        subcategories: subcategoriesData.filter(sub => sub.category_id === category.id).map(sub => ({
          ...sub,
          search_terms: sub.search_terms || []
        }))
      }));

      setCategories(categoriesWithSubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des catégories');
    }
  };

  // Charger les adresses utilisateur
  const loadUserAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('created_at');

      if (error) throw error;

      // Convertir les coordonnées point en array [lng, lat]
      const addressesWithCoords: UserAddress[] = data.map(addr => ({
        ...addr,
        category_type: addr.category_type as 'main' | 'family' | 'work' | 'school',
        is_primary: addr.is_primary || false,
        coordinates: [
          parseFloat((addr.coordinates as string).split(',')[0].replace('(', '')),
          parseFloat((addr.coordinates as string).split(',')[1].replace(')', ''))
        ] as [number, number]
      }));

      setUserAddresses(addressesWithCoords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des adresses');
    }
  };

  // Charger les modes de transport avec préférences utilisateur
  const loadTransportModes = async () => {
    try {
      const { data: modesData, error: modesError } = await supabase
        .from('transport_modes')
        .select('*')
        .order('sort_order');

      if (modesError) throw modesError;

      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_transport_preferences')
        .select('*');

      if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;

      // Combiner les modes avec les préférences utilisateur
      const modesWithPreferences = modesData.map(mode => {
        const userPreference = preferencesData?.find(pref => pref.transport_mode_id === mode.id);
        return {
          ...mode,
          custom_color: userPreference?.custom_color || mode.default_color
        };
      });

      setTransportModes(modesWithPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des modes de transport');
    }
  };

  // Ajouter une adresse utilisateur
  const addUserAddress = async (address: Omit<UserAddress, 'id' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          ...address,
          user_id: user.id,
          coordinates: `(${address.coordinates[0]},${address.coordinates[1]})`
        })
        .select()
        .single();

      if (error) throw error;

      const newAddress: UserAddress = {
        ...data,
        category_type: data.category_type as 'main' | 'family' | 'work' | 'school',
        is_primary: data.is_primary || false,
        coordinates: address.coordinates
      };

      setUserAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'ajout de l\'adresse');
      throw err;
    }
  };

  // Mettre à jour une adresse
  const updateUserAddress = async (id: string, updates: Partial<UserAddress>) => {
    try {
      const updateData = { ...updates };
      if (updates.coordinates) {
        updateData.coordinates = `(${updates.coordinates[0]},${updates.coordinates[1]})` as any;
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedAddress: UserAddress = {
        ...data,
        category_type: data.category_type as 'main' | 'family' | 'work' | 'school',
        is_primary: data.is_primary || false,
        coordinates: updates.coordinates || userAddresses.find(addr => addr.id === id)?.coordinates || [0, 0]
      };

      setUserAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      return updatedAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour de l\'adresse');
      throw err;
    }
  };

  // Supprimer une adresse
  const deleteUserAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUserAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression de l\'adresse');
      throw err;
    }
  };

  // Mettre à jour la couleur d'un mode de transport
  const updateTransportColor = async (transportModeId: string, color: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_transport_preferences')
        .upsert({
          user_id: user.id,
          transport_mode_id: transportModeId,
          custom_color: color
        });

      if (error) throw error;

      setTransportModes(prev => prev.map(mode => 
        mode.id === transportModeId 
          ? { ...mode, custom_color: color }
          : mode
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour de la couleur');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadCategories(),
        loadUserAddresses(),
        loadTransportModes()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    categories,
    userAddresses,
    transportModes,
    loading,
    error,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    updateTransportColor,
    refetch: () => {
      loadCategories();
      loadUserAddresses();
      loadTransportModes();
    }
  };
};