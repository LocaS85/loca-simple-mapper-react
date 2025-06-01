
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxGeocodingService } from './mapbox/geocoding';
import { MapboxDirectionsService } from './mapbox/directions';
import { MapboxIsochroneService } from './mapbox/isochrone';
import { MapboxSearchResult, MapboxDirectionsResult, MapboxSearchOptions } from './mapbox/types';
import { TransportMode } from '@/types';

class MapboxApiService {
  private geocodingService: MapboxGeocodingService;
  private directionsService: MapboxDirectionsService;
  private isochroneService: MapboxIsochroneService;
  private isInitialized = false;

  constructor() {
    this.geocodingService = new MapboxGeocodingService();
    this.directionsService = new MapboxDirectionsService();
    this.isochroneService = new MapboxIsochroneService();
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      if (isMapboxTokenValid()) {
        console.log('🎯 Service Mapbox initialisé avec succès');
        this.isInitialized = true;
        return true;
      } else {
        console.error('❌ Token Mapbox public non configuré ou invalide');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du service Mapbox:', error);
      return false;
    }
  }

  async searchPlaces(query: string, center: [number, number], options: MapboxSearchOptions = {}): Promise<MapboxSearchResult[]> {
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }
    return this.geocodingService.searchPlaces(query, center, options);
  }

  async getDirections(origin: [number, number], destination: [number, number], transportMode: TransportMode = 'walking'): Promise<MapboxDirectionsResult> {
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }
    return this.directionsService.getDirections(origin, destination, transportMode);
  }

  async createIsochrone(center: [number, number], duration: number, transportMode: TransportMode = 'walking'): Promise<any> {
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }
    return this.isochroneService.createIsochrone(center, duration, transportMode);
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  reset(): void {
    this.isInitialized = false;
  }
}

export const mapboxApiService = new MapboxApiService();

export const useMapboxApi = () => {
  return {
    searchPlaces: mapboxApiService.searchPlaces.bind(mapboxApiService),
    getDirections: mapboxApiService.getDirections.bind(mapboxApiService),
    createIsochrone: mapboxApiService.createIsochrone.bind(mapboxApiService),
    isReady: mapboxApiService.isReady.bind(mapboxApiService),
    initialize: mapboxApiService.initialize.bind(mapboxApiService)
  };
};
