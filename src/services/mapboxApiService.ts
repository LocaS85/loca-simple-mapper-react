
import { TransportMode } from '@/types/map';
import { SearchResult } from '@/types/geosearch';
import { secureMapboxService } from './secureMapboxService';

interface SearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}

// Transport mode mapping for Mapbox
const getMapboxProfile = (transportMode: TransportMode): string => {
  const profileMap: Record<TransportMode, string> = {
    driving: 'driving',
    walking: 'walking',
    cycling: 'cycling',
    transit: 'walking',
    car: 'driving',
    bus: 'walking',
    train: 'walking'
  };
  
  return profileMap[transportMode] || 'walking';
};

export const mapboxApiService = {
  async initialize(): Promise<boolean> {
    try {
      // Test de connectivité avec le service sécurisé
      console.log('🔧 Initializing secure Mapbox service...');
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'initialisation Mapbox:', error);
      return false;
    }
  },

  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    return secureMapboxService.searchPlaces(query, center, options);
  },

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode
  ) {
    return secureMapboxService.getDirections(origin, destination, transportMode);
  },

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode
  ) {
    return secureMapboxService.createIsochrone(center, duration, transportMode);
  },

  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    return secureMapboxService.calculateDistance(coord1, coord2);
  },

  calculateBoundingBox(center: [number, number], radiusKm: number): [number, number, number, number] {
    return secureMapboxService.calculateBoundingBox(center, radiusKm);
  }
};
