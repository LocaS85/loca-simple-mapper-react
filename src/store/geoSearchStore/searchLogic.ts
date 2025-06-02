
import { SearchResult } from '@/types/geosearch';
import { MapboxSearchResult } from '@/services/mapbox/types';

export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371;
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const convertMapboxToSearchResult = (mapboxResult: MapboxSearchResult, userLocation: [number, number]): SearchResult => {
  const distance = calculateDistance(userLocation, mapboxResult.coordinates);
  
  return {
    id: mapboxResult.id,
    name: mapboxResult.name,
    address: mapboxResult.address,
    coordinates: mapboxResult.coordinates,
    type: mapboxResult.category,
    category: mapboxResult.category,
    distance: Math.round(distance * 10) / 10,
    duration: Math.round(distance * 12)
  };
};

export const createCacheKey = (filters: any, userLocation: [number, number]): string => {
  return `${userLocation.join(',')}-${JSON.stringify(filters)}`;
};

export const isCacheValid = (cacheEntry: { timestamp: number; expiry: number }): boolean => {
  return Date.now() < cacheEntry.expiry;
};

export const createMockResults = (userLocation: [number, number]): SearchResult[] => [
  {
    id: 'test-1',
    name: 'Restaurant Le Bon Goût',
    address: '123 Rue de la Paix, France',
    coordinates: [userLocation[0] + 0.001, userLocation[1] + 0.001] as [number, number],
    type: 'restaurant',
    category: 'restaurant',
    distance: 0.2,
    duration: 3
  },
  {
    id: 'test-2',
    name: 'Café des Arts',
    address: '45 Avenue de la République, France',
    coordinates: [userLocation[0] + 0.002, userLocation[1] - 0.001] as [number, number],
    type: 'cafe',
    category: 'cafe',
    distance: 0.3,
    duration: 4
  },
  {
    id: 'test-3',
    name: 'Boutique Mode',
    address: '78 Boulevard Haussmann, France',
    coordinates: [userLocation[0] - 0.002, userLocation[1] + 0.002] as [number, number],
    type: 'shop',
    category: 'shop',
    distance: 0.4,
    duration: 5
  }
];
