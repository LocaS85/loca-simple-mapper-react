
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { validateMapboxToken, getValidatedToken } from '@/utils/mapboxValidation';
import { TransportMode } from '@/types';

export interface MapboxSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  relevance?: number;
}

export interface MapboxDirectionsResult {
  geometry: any;
  distance: number;
  duration: number;
  steps?: any[];
}

class MapboxApiService {
  private token: string | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized && this.token) {
        return true;
      }

      // Essayer d'obtenir un token validé
      this.token = await getValidatedToken();
      
      if (!this.token) {
        // Fallback : essayer le token de config
        if (isMapboxTokenValid()) {
          this.token = getMapboxToken();
          const isValid = await validateMapboxToken(this.token);
          if (!isValid) {
            this.token = null;
            return false;
          }
        } else {
          return false;
        }
      }

      this.isInitialized = true;
      console.log('🎯 Service Mapbox initialisé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'initialisation du service Mapbox:', error);
      return false;
    }
  }

  async searchPlaces(query: string, center: [number, number], options: {
    limit?: number;
    radius?: number;
    categories?: string[];
  } = {}): Promise<MapboxSearchResult[]> {
    
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }

    const { limit = 10, radius = 10 } = options;

    // Construire les paramètres de recherche
    const searchParams = new URLSearchParams({
      access_token: this.token!,
      proximity: center.join(','),
      limit: limit.toString(),
      country: 'fr',
      language: 'fr'
    });

    // Ajouter bbox si radius est spécifié
    if (radius > 0) {
      const bbox = this.calculateBbox(center, radius);
      searchParams.append('bbox', bbox.join(','));
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 401) {
        throw new Error('Token Mapbox invalide ou expiré');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur API Mapbox: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data.features?.map((feature: any, index: number) => ({
        id: feature.id || `result-${index}`,
        name: feature.text || feature.place_name,
        address: feature.place_name,
        coordinates: feature.center as [number, number],
        category: this.determineCategory(feature),
        relevance: feature.relevance
      })) || [];
      
    } catch (error) {
      console.error('Erreur lors de la recherche Mapbox:', error);
      throw error;
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode = 'walking'
  ): Promise<MapboxDirectionsResult> {
    
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }

    const profile = this.getMapboxProfile(transportMode);
    const coordinates = `${origin.join(',')};${destination.join(',')}`;
    
    const params = new URLSearchParams({
      access_token: this.token!,
      geometries: 'geojson',
      overview: 'full',
      steps: 'true'
    });

    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 401) {
        throw new Error('Token Mapbox invalide pour les directions');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur Directions API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('Aucun itinéraire trouvé');
      }
      
      return {
        geometry: data.routes[0].geometry,
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
        steps: data.routes[0].legs?.[0]?.steps || []
      };
      
    } catch (error) {
      console.error('Erreur lors du calcul d\'itinéraire:', error);
      throw error;
    }
  }

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode = 'walking'
  ): Promise<any> {
    
    if (!await this.initialize()) {
      throw new Error('Service Mapbox non initialisé');
    }

    const profile = this.getMapboxProfile(transportMode);
    
    const params = new URLSearchParams({
      access_token: this.token!,
      contours_minutes: duration.toString(),
      polygons: 'true',
      denoise: '1'
    });

    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center.join(',')}?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur Isochrone API: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur lors de la création d\'isochrone:', error);
      throw error;
    }
  }

  private calculateBbox(center: [number, number], radiusKm: number): [number, number, number, number] {
    const radiusInDegrees = radiusKm / 111.32; // Approximation : 1 degré ≈ 111.32 km
    return [
      center[0] - radiusInDegrees, // ouest
      center[1] - radiusInDegrees, // sud
      center[0] + radiusInDegrees, // est
      center[1] + radiusInDegrees  // nord
    ];
  }

  private getMapboxProfile(transportMode: TransportMode): string {
    const profileMap: Record<TransportMode, string> = {
      'car': 'driving',
      'walking': 'walking',
      'cycling': 'cycling',
      'bus': 'driving',
      'train': 'driving'
    };
    return profileMap[transportMode] || 'driving';
  }

  private determineCategory(feature: any): string {
    if (feature.properties?.category) {
      return feature.properties.category;
    }
    
    const placeType = feature.place_type?.[0];
    const categoryMap: Record<string, string> = {
      'poi': 'Point d\'intérêt',
      'address': 'Adresse',
      'place': 'Lieu',
      'region': 'Région',
      'country': 'Pays'
    };
    
    return categoryMap[placeType] || 'Inconnu';
  }

  // Méthode utilitaire pour vérifier l'état du service
  isReady(): boolean {
    return this.isInitialized && !!this.token;
  }

  // Méthode pour réinitialiser le service (utile pour les tests ou changements de token)
  reset(): void {
    this.token = null;
    this.isInitialized = false;
  }
}

// Instance singleton du service
export const mapboxApiService = new MapboxApiService();

// Hook pour utiliser le service dans les composants React
export const useMapboxApi = () => {
  return {
    searchPlaces: mapboxApiService.searchPlaces.bind(mapboxApiService),
    getDirections: mapboxApiService.getDirections.bind(mapboxApiService),
    createIsochrone: mapboxApiService.createIsochrone.bind(mapboxApiService),
    isReady: mapboxApiService.isReady.bind(mapboxApiService),
    initialize: mapboxApiService.initialize.bind(mapboxApiService)
  };
};
