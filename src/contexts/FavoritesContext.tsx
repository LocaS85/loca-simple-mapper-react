
import React, { createContext, useContext } from 'react';
import { useFavoritesSupabase, FavoritePlace } from '@/hooks/useFavoritesSupabase';
import { SearchResult } from '@/types/geosearch';

interface FavoritesContextType {
  favorites: FavoritePlace[];
  loading: boolean;
  addFavorite: (result: SearchResult) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (result: SearchResult) => Promise<void>;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => Promise<void>;
  refetch: () => Promise<void>;
  favoritesCount: number;
  // Alias methods for backward compatibility
  addToFavorites: (result: SearchResult) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
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
  const favoritesHook = useFavoritesSupabase();

  // Create extended interface with aliases for backward compatibility
  const extendedHook = {
    ...favoritesHook,
    addFavorite: favoritesHook.addToFavorites,
    removeFavorite: favoritesHook.removeFromFavorites,
  };

  return (
    <FavoritesContext.Provider value={extendedHook}>
      {children}
    </FavoritesContext.Provider>
  );
};
