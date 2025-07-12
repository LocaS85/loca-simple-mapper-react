import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { SearchResult } from '@/types/geosearch';
import { UserAddress } from '@/hooks/useSupabaseCategories';

interface FavoriteAddressButtonProps {
  address: UserAddress;
  categoryName: string;
}

const FavoriteAddressButton: React.FC<FavoriteAddressButtonProps> = ({ 
  address, 
  categoryName 
}) => {
  const { addToFavorites } = useFavorites();
  const { toast } = useToast();

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites({
        id: address.id,
        name: address.name,
        address: address.address,
        coordinates: address.coordinates,
        category: categoryName
      } as SearchResult);
      
      toast({
        title: "Ajouté aux favoris",
        description: `${address.name} a été ajouté à vos favoris.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddToFavorites}
      className="h-8 w-8 p-0 hover:bg-yellow-100 hover:text-yellow-700"
      title="Ajouter aux favoris"
    >
      <Star className="h-4 w-4" />
    </Button>
  );
};

export default FavoriteAddressButton;