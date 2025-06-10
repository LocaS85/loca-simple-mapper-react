
import { SearchResult } from '@/types/geosearch';
import { MapboxSearchResult } from '@/services/mapbox/types';

export interface SearchPlace {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance?: number;
  duration?: number;
  relevance?: number;
  properties?: Record<string, any>;
}

export const transformSearchPlacesToResults = (
  places: SearchPlace[],
  userLocation: [number, number]
): SearchResult[] => {
  return places.map((place) => ({
    id: place.id,
    name: place.name,
    address: place.address,
    coordinates: place.coordinates,
    type: place.category || 'point_of_interest', // Ajout du type requis
    category: place.category,
    distance: place.distance || calculateDistance(userLocation, place.coordinates),
    duration: place.duration || estimateDuration(place.distance || 0, 'walking')
  }));
};

export const transformMapboxToSearchResult = (
  mapboxResult: MapboxSearchResult,
  userLocation: [number, number]
): SearchResult => {
  const distance = calculateDistance(userLocation, mapboxResult.coordinates);
  
  return {
    id: mapboxResult.id,
    name: mapboxResult.name,
    address: mapboxResult.address,
    coordinates: mapboxResult.coordinates,
    type: mapboxResult.category || 'point_of_interest',
    category: mapboxResult.category,
    distance: Math.round(distance * 10) / 10,
    duration: estimateDuration(distance, 'walking')
  };
};

const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const estimateDuration = (distance: number, transport: string): number => {
  const speeds = {
    walking: 5, // km/h
    cycling: 15,
    car: 30,
    bus: 20,
    train: 40
  };
  
  const speed = speeds[transport as keyof typeof speeds] || speeds.walking;
  return Math.round((distance / speed) * 60); // minutes
};
