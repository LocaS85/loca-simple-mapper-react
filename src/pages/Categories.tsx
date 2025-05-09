
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
}

const categoriesData: Category[] = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: '🍽️',
    subcategories: [
      { id: 'french', name: 'Cuisine française', description: 'Restaurants proposant des plats traditionnels français' },
      { id: 'italian', name: 'Cuisine italienne', description: 'Pizzerias et restaurants italiens' },
      { id: 'asian', name: 'Cuisine asiatique', description: 'Restaurants japonais, chinois, thaïlandais, etc.' },
      { id: 'fast-food', name: 'Fast-Food', description: 'Restauration rapide et chaînes internationales' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Divertissement',
    icon: '🎭',
    subcategories: [
      { id: 'cinema', name: 'Cinémas', description: 'Salles de projection et cinémas' },
      { id: 'theater', name: 'Théâtres', description: 'Salles de spectacles et théâtres' },
      { id: 'museum', name: 'Musées', description: 'Musées et galeries d\'art' },
      { id: 'park', name: 'Parcs', description: 'Parcs d\'attractions et espaces verts' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    subcategories: [
      { id: 'mall', name: 'Centres commerciaux', description: 'Grands centres commerciaux et galeries marchandes' },
      { id: 'clothing', name: 'Vêtements', description: 'Boutiques de mode et magasins de vêtements' },
      { id: 'tech', name: 'Électronique', description: 'Magasins d\'électronique et de high-tech' },
      { id: 'grocery', name: 'Supermarchés', description: 'Épiceries, supermarchés et hypermarchés' }
    ]
  },
  {
    id: 'health',
    name: 'Santé',
    icon: '⚕️',
    subcategories: [
      { id: 'hospital', name: 'Hôpitaux', description: 'Centres hospitaliers et cliniques' },
      { id: 'pharmacy', name: 'Pharmacies', description: 'Pharmacies et parapharmacies' },
      { id: 'doctor', name: 'Médecins', description: 'Cabinets médicaux et spécialistes' },
      { id: 'emergency', name: 'Urgences', description: 'Services d\'urgence et d\'assistance médicale' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚌',
    subcategories: [
      { id: 'bus', name: 'Bus', description: 'Arrêts de bus et gares routières' },
      { id: 'metro', name: 'Métro', description: 'Stations de métro et tramway' },
      { id: 'train', name: 'Trains', description: 'Gares ferroviaires et services de train' },
      { id: 'taxi', name: 'Taxis', description: 'Stations de taxis et services VTC' }
    ]
  }
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Catégories</h1>
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-8'}`}>
        {/* Categories list */}
        <div className={`${isMobile ? 'mb-6' : 'w-1/3'}`}>
          <h2 className="text-lg font-semibold mb-3">Toutes les catégories</h2>
          <div className="space-y-2">
            {categoriesData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between ${
                  selectedCategory?.id === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
        
        {/* Subcategories content */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
          {selectedCategory ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                <span className="mr-2">{selectedCategory.icon}</span>
                {selectedCategory.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/search?category=${selectedCategory.id}&subcategory=${subcategory.id}`}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <h3 className="font-medium text-lg mb-2">{subcategory.name}</h3>
                    <p className="text-gray-600 text-sm">{subcategory.description}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg">Sélectionnez une catégorie pour voir les sous-catégories</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
