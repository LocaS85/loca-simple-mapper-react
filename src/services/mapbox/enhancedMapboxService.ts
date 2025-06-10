import { getMapboxToken } from '@/utils/mapboxConfig';
import { mapboxErrorHandler, MapboxErrorContext } from './errorHandler';
import { offlineCacheService } from '../offlineCache';
import { TransportMode } from '@/lib/data/transportModes';
import { MapboxSearchResult, MapboxDirectionsResult } from './types';

export class EnhancedMapboxService {
  private token: string;
  private initialized = false;

  constructor() {
    this.token = '';
  }

  async initialize(): Promise<boolean> {
    try {
      this.token = getMapboxToken();
      this.initialized = true;
      console.log('✅ Service Mapbox Enhanced initialisé');
      return true;
    } catch (error) {
      const context: MapboxErrorContext = { operation: 'initialization' };
      mapboxErrorHandler.handleError(error, context);
      this.initialized = false;
      return false;
    }
  }

  async searchPlaces(
    query: string,
    center: [number, number],
    options: {
      limit?: number;
      radius?: number;
      categories?: string[];
    } = {}
  ): Promise<MapboxSearchResult[]> {
    const context: MapboxErrorContext = {
      operation: 'geocoding',
      userLocation: center,
      params: { query, options }
    };

    if (!this.initialized) {
      await this.initialize();
    }

    // Vérifier d'abord le cache
    const cacheKey = `search_${query}_${center.join(',')}_${JSON.stringify(options)}`;
    const cachedResults = offlineCacheService.get<MapboxSearchResult[]>(cacheKey);
    if (cachedResults) {
      console.log('📦 Résultats de recherche trouvés en cache');
      return cachedResults;
    }

    // Sauvegarder la position pour les fallbacks
    mapboxErrorHandler.setLastKnownLocation(center);

    return mapboxErrorHandler.retryWithBackoff(
      async () => {
        return this.performSearch(query, center, options);
      },
      context,
      3,
      1000
    ).then(results => {
      // Mettre en cache les résultats réussis
      offlineCacheService.set(cacheKey, results, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        priority: 'high'
      });
      return results;
    }).catch(error => {
      console.warn('🔄 Utilisation du fallback hors-ligne pour la recherche');
      const fallbackResults = mapboxErrorHandler.getOfflineFallback('geocoding', { query, center, options }) || [];
      return fallbackResults;
    });
  }

  private async performSearch(
    query: string,
    center: [number, number],
    options: {
      limit?: number;
      radius?: number;
      categories?: string[];
    }
  ): Promise<MapboxSearchResult[]> {
    const { limit = 5, radius = 10, categories } = options;
    
    const searchParams = new URLSearchParams({
      access_token: this.token,
      proximity: `${center[0]},${center[1]}`,
      limit: limit.toString(),
      country: 'fr',
      language: 'fr',
      types: 'poi,address',
      autocomplete: 'true'
    });

    // Ajouter bbox basé sur le rayon
    if (radius > 0) {
      const radiusInDegrees = radius / 111.32;
      const bbox = [
        center[0] - radiusInDegrees,
        center[1] - radiusInDegrees,
        center[0] + radiusInDegrees,
        center[1] + radiusInDegrees
      ];
      searchParams.append('bbox', bbox.join(','));
    }

    if (categories && categories.length > 0) {
      searchParams.append('category', categories.join(','));
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LocaSimple/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.features?.map((feature: any, index: number): MapboxSearchResult => ({
        id: feature.id || `place-${Date.now()}-${index}`,
        name: feature.text || feature.properties?.name || 'Lieu sans nom',
        address: feature.place_name || '',
        coordinates: feature.geometry.coordinates as [number, number],
        category: this.extractCategory(feature),
        distance: this.calculateDistance(center, feature.geometry.coordinates),
        relevance: feature.relevance || 0,
        properties: feature.properties || {}
      })) || [];

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode = 'walking'
  ): Promise<MapboxDirectionsResult | null> {
    const context: MapboxErrorContext = {
      operation: 'directions',
      userLocation: origin,
      params: { destination, transportMode }
    };

    if (!this.initialized) {
      await this.initialize();
    }

    // Vérifier le cache pour les directions
    const cachedDirections = offlineCacheService.getCachedDirections(origin, destination);
    if (cachedDirections) {
      console.log('📦 Directions trouvées en cache');
      return cachedDirections;
    }

    return mapboxErrorHandler.retryWithBackoff(
      async () => {
        return this.performDirections(origin, destination, transportMode);
      },
      context,
      2,
      1500
    ).then(directions => {
      // Mettre en cache les directions réussies
      if (directions) {
        offlineCacheService.cacheDirections(origin, destination, directions);
      }
      return directions;
    }).catch(error => {
      console.warn('🔄 Utilisation du fallback hors-ligne pour les directions');
      return mapboxErrorHandler.getOfflineFallback('directions');
    });
  }

  private async performDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode
  ): Promise<MapboxDirectionsResult | null> {
    const profile = this.getMapboxProfile(transportMode);
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${this.token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LocaSimple/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          geometry: route.geometry,
          distance: route.distance,
          duration: route.duration,
          steps: route.legs?.[0]?.steps || []
        };
      }

      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getMapboxProfile(transportMode: TransportMode): string {
    switch (transportMode) {
      case 'car': return 'driving';
      case 'walking': return 'walking';
      case 'cycling': return 'cycling';
      case 'bus':
      case 'train': return 'driving'; // Fallback
      default: return 'walking';
    }
  }

  private extractCategory(feature: any): string {
    if (feature.properties?.category) {
      return feature.properties.category;
    }
    
    const placeType = feature.place_type?.[0];
    switch (placeType) {
      case 'poi': return 'point_of_interest';
      case 'address': return 'address';
      default: return 'general';
    }
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2[1] - point1[1]) * Math.PI / 180;
    const dLon = (point2[0] - point1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const enhancedMapboxService = new EnhancedMapboxService();

}
