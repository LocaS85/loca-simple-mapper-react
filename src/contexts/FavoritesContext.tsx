
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Favorite {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  savedAt: number;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (item: Omit<Favorite, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: Omit<Favorite, 'savedAt'>) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('geosearch_favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('geosearch_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  const addFavorite = (item: Omit<Favorite, 'savedAt'>) => {
    if (isFavorite(item.id)) return;
    
    const newFavorite: Favorite = {
      ...item,
      savedAt: Date.now()
    };
    
    setFavorites(prev => [...prev, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const toggleFavorite = (item: Omit<Favorite, 'savedAt'>) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
