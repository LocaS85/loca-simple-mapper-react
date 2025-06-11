
import { useState, useEffect } from 'react';
import { SearchResult } from '@/types/geosearch';

const FAVORITES_STORAGE_KEY = 'geosearch_favorites';

export interface FavoritePlace {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  savedAt: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setFavorites([]);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage
  const saveFavorites = (newFavorites: FavoritePlace[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  };

  // Vérifier si un lieu est en favori
  const isFavorite = (placeId: string): boolean => {
    return favorites.some(fav => fav.id === placeId);
  };

  // Ajouter un lieu aux favoris
  const addToFavorites = (result: SearchResult): void => {
    if (isFavorite(result.id)) {
      console.log('Lieu déjà en favoris:', result.id);
      return;
    }

    const newFavorite: FavoritePlace = {
      id: result.id,
      name: result.name,
      address: result.address,
      coordinates: result.coordinates,
      category: result.category,
      savedAt: Date.now()
    };

    const newFavorites = [...favorites, newFavorite];
    saveFavorites(newFavorites);
    console.log('✅ Lieu ajouté aux favoris:', result.name);
  };

  // Retirer un lieu des favoris
  const removeFromFavorites = (placeId: string): void => {
    const newFavorites = favorites.filter(fav => fav.id !== placeId);
    saveFavorites(newFavorites);
    console.log('❌ Lieu retiré des favoris:', placeId);
  };

  // Basculer l'état favori d'un lieu
  const toggleFavorite = (result: SearchResult): void => {
    if (isFavorite(result.id)) {
      removeFromFavorites(result.id);
    } else {
      addToFavorites(result);
    }
  };

  // Vider tous les favoris
  const clearFavorites = (): void => {
    saveFavorites([]);
    console.log('🗑️ Tous les favoris ont été supprimés');
  };

  // Exporter les favoris (pour sauvegarde externe)
  const exportFavorites = (): string => {
    return JSON.stringify(favorites, null, 2);
  };

  // Importer des favoris (depuis sauvegarde externe)
  const importFavorites = (favoritesJson: string): boolean => {
    try {
      const imported = JSON.parse(favoritesJson);
      if (Array.isArray(imported)) {
        saveFavorites(imported);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import des favoris:', error);
      return false;
    }
  };

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    exportFavorites,
    importFavorites,
    favoritesCount: favorites.length
  };
};
