
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';

export const convertMapboxToSearchResult = (mapboxResult: any, userLocation: [number, number]): SearchResult => {
  return {
    id: mapboxResult.id,
    name: mapboxResult.name,
    address: mapboxResult.address || 'Adresse non disponible',
    coordinates: mapboxResult.coordinates,
    type: mapboxResult.type,
    category: mapboxResult.category,
    distance: mapboxResult.distance,
    duration: mapboxResult.duration
  };
};

export const createCacheKey = (filters: GeoSearchFilters, userLocation: [number, number]): string => {
  return `${userLocation[0]},${userLocation[1]}-${filters.query || ''}-${filters.category || ''}-${filters.distance}`;
};

export const createMockResults = (userLocation: [number, number]): SearchResult[] => {
  return [
    {
      id: 'mock-1',
      name: 'Restaurant Local',
      address: 'Adresse exemple',
      coordinates: [userLocation[0] + 0.001, userLocation[1] + 0.001],
      type: 'restaurant',
      category: 'restaurant',
      distance: 0.1,
      duration: 2
    }
  ];
};

export const calculateDistance = ([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
