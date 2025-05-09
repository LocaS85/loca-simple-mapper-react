
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for favorite places
const mockFavorites = [
  {
    id: 'fav1',
    name: 'Tour Eiffel',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    category: 'Monument',
    date: '12 avril 2025'
  },
  {
    id: 'fav2',
    name: 'Café de la Paix',
    address: '5 Place de l\'Opéra, 75009 Paris',
    category: 'Restaurant',
    date: '10 avril 2025'
  }
];

const Favorites = () => {
  const isMobile = useIsMobile();
  const hasFavorites = mockFavorites.length > 0;

  const removeFavorite = (id: string) => {
    console.log('Remove favorite with id:', id);
    // In a real implementation, this would remove the favorite from storage/API
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mes Favoris</h1>
      
      {hasFavorites ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-500">{mockFavorites.length} lieux enregistrés</p>
            </div>
            <div className="flex gap-2">
              <div className={`relative ${isMobile ? 'hidden' : 'block'}`}>
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos favoris"
                  className="pl-10 pr-4 py-2 border rounded-md w-64"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className={isMobile ? 'hidden' : 'inline'}>Voir sur la carte</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFavorites.map((favorite) => (
              <div key={favorite.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => removeFavorite(favorite.id)}
                      className="p-2 rounded-full bg-white shadow-sm text-red-500 hover:bg-red-50"
                      aria-label="Remove from favorites"
                    >
                      <Heart fill="currentColor" size={16} />
                    </button>
                  </div>
                  {/* This would be the place image in a real implementation */}
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <MapPin size={48} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{favorite.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{favorite.address}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {favorite.category}
                    </span>
                    <span className="text-xs text-gray-500">Ajouté le {favorite.date}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Link to={`/?place=${favorite.id}`} className="text-blue-600 text-sm hover:underline">
                    Voir sur la carte
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium mb-2">Vous n'avez pas encore de favoris</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Explorez la carte et ajoutez des lieux à vos favoris pour les retrouver facilement plus tard.
          </p>
          <Button asChild>
            <Link to="/">Explorer la carte</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
