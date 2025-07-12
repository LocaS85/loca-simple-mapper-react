import { useState, useEffect } from 'react';
import { SearchResult } from '@/types/geosearch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FavoritePlace {
  id: string;
  place_name: string;
  place_address: string | null;
  coordinates: [number, number];
  category: string | null;
  notes: string | null;
  created_at: string;
}

export const useFavoritesSupabase = () => {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites from Supabase
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage for non-authenticated users
        const stored = localStorage.getItem('geosearch_favorites');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert localStorage format to Supabase format
          const converted = Array.isArray(parsed) ? parsed.map((fav: any) => ({
            id: fav.id,
            place_name: fav.name,
            place_address: fav.address,
            coordinates: fav.coordinates,
            category: fav.category,
            notes: null,
            created_at: new Date(fav.savedAt).toISOString()
          })) : [];
          setFavorites(converted);
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      // Convert coordinates from PostGIS point to array
      const favoritesWithCoords = data?.map(fav => ({
        ...fav,
        coordinates: Array.isArray(fav.coordinates) 
          ? fav.coordinates as [number, number]
          : [0, 0] as [number, number]
      })) || [];

      setFavorites(favoritesWithCoords);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Check if a place is favorited
  const isFavorite = (placeId: string): boolean => {
    return favorites.some(fav => fav.id === placeId);
  };

  // Add to favorites
  const addToFavorites = async (result: SearchResult): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage for non-authenticated users
        const stored = localStorage.getItem('geosearch_favorites') || '[]';
        const parsed = JSON.parse(stored);
        const newFavorite = {
          id: result.id,
          name: result.name,
          address: result.address,
          coordinates: result.coordinates,
          category: result.category,
          savedAt: Date.now()
        };
        const updated = [...parsed, newFavorite];
        localStorage.setItem('geosearch_favorites', JSON.stringify(updated));
        await loadFavorites();
        return;
      }

      if (isFavorite(result.id)) {
        toast({
          title: "Déjà en favoris",
          description: "Ce lieu est déjà dans vos favoris.",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          id: result.id,
          place_name: result.name,
          place_address: result.address,
          coordinates: `POINT(${result.coordinates[0]} ${result.coordinates[1]})`,
          category: result.category,
          user_id: user.id
        });

      if (error) {
        console.error('Error adding to favorites:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter aux favoris.",
          variant: "destructive",
        });
        return;
      }

      await loadFavorites();
      toast({
        title: "Ajouté aux favoris",
        description: `${result.name} a été ajouté à vos favoris.`,
      });

    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris.",
        variant: "destructive",
      });
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (placeId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage
        const stored = localStorage.getItem('geosearch_favorites') || '[]';
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((fav: any) => fav.id !== placeId);
        localStorage.setItem('geosearch_favorites', JSON.stringify(filtered));
        await loadFavorites();
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', placeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing from favorites:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer des favoris.",
          variant: "destructive",
        });
        return;
      }

      await loadFavorites();
      toast({
        title: "Supprimé des favoris",
        description: "Le lieu a été supprimé de vos favoris.",
      });

    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer des favoris.",
        variant: "destructive",
      });
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (result: SearchResult): Promise<void> => {
    if (isFavorite(result.id)) {
      await removeFromFavorites(result.id);
    } else {
      await addToFavorites(result);
    }
  };

  // Clear all favorites
  const clearFavorites = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        localStorage.removeItem('geosearch_favorites');
        await loadFavorites();
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing favorites:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vider les favoris.",
          variant: "destructive",
        });
        return;
      }

      await loadFavorites();
      toast({
        title: "Favoris vidés",
        description: "Tous vos favoris ont été supprimés.",
      });

    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider les favoris.",
        variant: "destructive",
      });
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    refetch: loadFavorites,
    favoritesCount: favorites.length
  };
};