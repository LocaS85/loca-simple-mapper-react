
import { isMapboxTokenValid, getMapboxToken } from '@/utils/mapboxConfig';
import { validateMapboxToken } from '@/utils/mapboxValidation';
import { MapboxGeocodingService } from './mapbox/geocoding';
import { MapboxDirectionsService } from './mapbox/directions';
import { MapboxIsochroneService } from './mapbox/isochrone';
import { MapboxSearchResult, MapboxDirectionsResult, MapboxSearchOptions } from './mapbox/types';
import { TransportMode } from '@/lib/data/transportModes';
import { networkErrorHandler } from './networkErrorHandler';

class MapboxApiService {
  private geocodingService: MapboxGeocodingService;
  private directionsService: MapboxDirectionsService;
  private isochroneService: MapboxIsochroneService;
  private isInitialized = false;
  private token: string | null = null;

  constructor() {
    this.geocodingService = new MapboxGeocodingService();
    this.directionsService = new MapboxDirectionsService();
    this.isochroneService = new MapboxIsochroneService();
  }

  /**
   * Initialisation complète du service
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        console.log('🎯 Service Mapbox déjà initialisé');
        return true;
      }

      console.log('🚀 Initialisation du service Mapbox...');

      // Vérification basique du token
      if (!isMapboxTokenValid()) {
        console.error('❌ Token Mapbox non configuré ou format invalide');
        return false;
      }

      // Récupération du token
      this.token = getMapboxToken();
      console.log('🔑 Token récupéré:', this.token.substring(0, 15) + '...');

      // Validation par appel API
      const isValid = await validateMapboxToken(this.token);
      if (!isValid) {
        console.error('❌ Token Mapbox invalide lors du test API');
        return false;
      }

      this.isInitialized = true;
      console.log('✅ Service Mapbox initialisé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du service Mapbox:', error);
      return false;
    }
  }

  /**
   * Recherche de lieux avec gestion d'erreurs avancée
   */
  async searchPlaces(
    query: string, 
    center: [number, number], 
    options: MapboxSearchOptions = {}
  ): Promise<MapboxSearchResult[]> {
    if (!this.isInitialized && !await this.initialize()) {
      throw new Error('Service Mapbox non initialisé - vérifiez votre token');
    }
    
    return networkErrorHandler.handleApiCall(
      () => this.geocodingService.searchPlaces(query, center, options),
      (attempt) => console.log(`🔄 Recherche - Tentative ${attempt}`)
    );
  }

  /**
   * Calcul d'itinéraires avec retry automatique
   */
  async getDirections(
    origin: [number, number], 
    destination: [number, number], 
    transportMode: TransportMode = 'walking'
  ): Promise<MapboxDirectionsResult> {
    if (!this.isInitialized && !await this.initialize()) {
      throw new Error('Service Mapbox non initialisé - vérifiez votre token');
    }
    
    return networkErrorHandler.handleApiCall(
      () => this.directionsService.getDirections(origin, destination, transportMode),
      (attempt) => console.log(`🔄 Directions - Tentative ${attempt}`)
    );
  }

  /**
   * Création d'isochrones avec gestion d'erreurs
   */
  async createIsochrone(
    center: [number, number], 
    duration: number, 
    transportMode: TransportMode = 'walking'
  ): Promise<any> {
    if (!this.isInitialized && !await this.initialize()) {
      throw new Error('Service Mapbox non initialisé - vérifiez votre token');
    }
    
    return networkErrorHandler.handleApiCall(
      () => this.isochroneService.createIsochrone(center, duration, transportMode),
      (attempt) => console.log(`🔄 Isochrone - Tentative ${attempt}`)
    );
  }

  /**
   * Statut du service
   */
  isReady(): boolean {
    return this.isInitialized && !!this.token;
  }

  /**
   * Obtenir le token actuel
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Réinitialiser le service
   */
  reset(): void {
    this.isInitialized = false;
    this.token = null;
    networkErrorHandler.reset();
    console.log('🔄 Service Mapbox réinitialisé');
  }

  /**
   * Test de connectivité
   */
  async testConnection(): Promise<boolean> {
    try {
      const results = await this.searchPlaces('test', [2.3522, 48.8566], { limit: 1 });
      console.log('✅ Test de connectivité réussi');
      return true;
    } catch (error) {
      console.error('❌ Test de connectivité échoué:', error);
      return false;
    }
  }
}

// Instance singleton
export const mapboxApiService = new MapboxApiService();

// Hook pour utiliser l'API Mapbox
export const useMapboxApi = () => {
  return {
    searchPlaces: mapboxApiService.searchPlaces.bind(mapboxApiService),
    getDirections: mapboxApiService.getDirections.bind(mapboxApiService),
    createIsochrone: mapboxApiService.createIsochrone.bind(mapboxApiService),
    isReady: mapboxApiService.isReady.bind(mapboxApiService),
    initialize: mapboxApiService.initialize.bind(mapboxApiService),
    testConnection: mapboxApiService.testConnection.bind(mapboxApiService),
    reset: mapboxApiService.reset.bind(mapboxApiService)
  };
};
