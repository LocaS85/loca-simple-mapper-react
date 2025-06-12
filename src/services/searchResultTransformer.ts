
import { SearchResult } from '@/types/geosearch';
import { SearchPlace } from './unifiedApiService';

export const transformSearchPlacesToResults = (
  places: SearchResult[], 
  userLocation: [number, number]
): SearchResult[] => {
  return places.map(place => ({
    id: place.id,
    name: place.name,
    address: place.address || 'Adresse non disponible',
    coordinates: place.coordinates,
    type: place.type,
    category: place.category,
    distance: place.distance,
    duration: place.duration
  }));
};
