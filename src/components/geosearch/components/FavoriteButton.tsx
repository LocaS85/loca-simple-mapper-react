import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  result: SearchResult;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  result,
  className,
  size = 'sm',
  variant = 'ghost'
}) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const isItemFavorite = isFavorite(result.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(result);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'p-0 transition-all duration-200',
        isItemFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500',
        className
      )}
      title={isItemFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isItemFavorite ? 'fill-current' : ''
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;