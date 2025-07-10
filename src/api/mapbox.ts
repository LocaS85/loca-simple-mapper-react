
import { Place } from '@/types/unified';

// Interface locale pour SearchParams (compatibility)
interface SearchParams {
  query: string;
  proximity: [number, number];
  limit?: number;
  radius?: number;
  categories?: string[];
}

export const fetchPlaces = async (params: SearchParams): Promise<Place[]> => {
  const { query, proximity, limit, radius, categories } = params;
  // In a real app, this would make an API call to Mapbox
  // For now, we'll return mock data
  console.log('Search params:', { query, proximity, limit, radius, categories });
  
  // Return mock data
  return [
    {
      id: '1',
      name: 'Café de la Place',
      address: '123 Avenue Example, Paris',
      coordinates: [proximity[0] + 0.01, proximity[1] + 0.01],
      distance: 500,
      duration: 8,
      category: 'cafe'
    },
    {
      id: '2',
      name: 'Restaurant Le Délice',
      address: '45 Rue de la Gastronomie, Paris',
      coordinates: [proximity[0] - 0.01, proximity[1] - 0.005],
      distance: 750,
      duration: 12,
      category: 'restaurant'
    },
    {
      id: '3',
      name: 'Parc des Fleurs',
      address: 'Boulevard des Jardins, Paris',
      coordinates: [proximity[0] + 0.02, proximity[1] - 0.02],
      distance: 1200,
      duration: 15,
      category: 'park'
    }
  ];
};
