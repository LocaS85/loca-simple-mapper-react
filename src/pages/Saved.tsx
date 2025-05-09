
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for saved searches
const mockSaved = [
  {
    id: 'search1',
    query: 'Restaurants italiens',
    filters: { category: 'Restaurant', radius: '2km', transport: 'walking' },
    date: '12 avril 2025',
    count: 15
  },
  {
    id: 'search2',
    query: 'Pharmacies ouvertes',
    filters: { category: 'Santé', radius: '5km', transport: 'driving' },
    date: '10 avril 2025',
    count: 8
  },
  {
    id: 'search3',
    query: 'Stations de métro',
    filters: { category: 'Transport', radius: '1km', transport: 'walking' },
    date: '8 avril 2025',
    count: 6
  }
];

const Saved = () => {
  const isMobile = useIsMobile();
  const hasSaved = mockSaved.length > 0;

  const removeSaved = (id: string) => {
    console.log('Remove saved search with id:', id);
    // In a real implementation, this would remove the saved search from storage/API
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Recherches enregistrées</h1>
      
      {hasSaved ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-500">{mockSaved.length} recherches enregistrées</p>
            </div>
            <div className={`relative ${isMobile ? 'hidden' : 'block'}`}>
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrer vos recherches"
                className="pl-10 pr-4 py-2 border rounded-md w-64"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSaved.map((saved) => (
              <div key={saved.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{saved.query}</h3>
                    <button 
                      onClick={() => removeSaved(saved.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete saved search"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{saved.count} résultats</p>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(saved.filters).map(([key, value]) => (
                      <span key={key} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">Enregistrée le {saved.date}</span>
                    <Link to={`/?query=${encodeURIComponent(saved.query)}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Réutiliser
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <Bookmark size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium mb-2">Aucune recherche enregistrée</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Enregistrez vos recherches fréquentes pour y accéder facilement plus tard.
          </p>
          <Button asChild>
            <Link to="/">Nouvelle recherche</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Saved;
