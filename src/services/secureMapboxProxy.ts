import { mapboxConfigService } from './mapboxConfigService';
import { offlineCacheService } from './offlineCache';
import { networkErrorHandler } from './networkErrorHandler';

class SecureMapboxProxy {
  private readonly baseUrl = 'https://api.mapbox.com';
  private rateLimitCache = new Map<string, number>();
  private readonly rateLimitWindow = 60000; // 1 minute
  private readonly maxRequestsPerWindow = 50;

  async geocode(query: string, proximity?: [number, number]): Promise<any> {
    const cacheKey = `geocode_${query}_${proximity?.join(',') || 'no-proximity'}`;
    
    // Check cache first
    const cached = offlineCacheService.get(cacheKey);
    if (cached) {
      console.log('📦 Geocoding depuis le cache');
      return cached;
    }

    // Rate limiting check
    if (!this.checkRateLimit('geocode')) {
      throw new Error('Limite de taux dépassée pour le géocodage');
    }

    return networkErrorHandler.handleApiCall(async () => {
      const token = await mapboxConfigService.getMapboxToken();
      
      const params = new URLSearchParams({
        access_token: token,
        limit: '5',
        types: 'poi,address,place'
      });

      if (proximity) {
        params.append('proximity', proximity.join(','));
      }

      const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur geocoding: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache successful response
      offlineCacheService.set(cacheKey, data, { 
        maxAge: 15 * 60 * 1000, // 15 minutes
        priority: 'high' 
      });
      
      return data;
    });
  }

  async directions(coordinates: number[][], profile: string = 'driving'): Promise<any> {
    const cacheKey = `directions_${coordinates.map(c => c.join(',')).join('_')}_${profile}`;
    
    // Check cache first
    const cached = offlineCacheService.get(cacheKey);
    if (cached) {
      console.log('📦 Directions depuis le cache');
      return cached;
    }

    // Rate limiting check
    if (!this.checkRateLimit('directions')) {
      throw new Error('Limite de taux dépassée pour les directions');
    }

    return networkErrorHandler.handleApiCall(async () => {
      const token = await mapboxConfigService.getMapboxToken();
      
      const coordString = coordinates.map(coord => coord.join(',')).join(';');
      const params = new URLSearchParams({
        access_token: token,
        geometries: 'geojson',
        overview: 'full',
        steps: 'true'
      });

      const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordString}?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur directions: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache successful response
      offlineCacheService.set(cacheKey, data, { 
        maxAge: 30 * 60 * 1000, // 30 minutes
        priority: 'normal' 
      });
      
      return data;
    });
  }

  async isochrone(center: [number, number], profile: string, duration: number): Promise<any> {
    const cacheKey = `isochrone_${center.join(',')}_${profile}_${duration}`;
    
    // Check cache first
    const cached = offlineCacheService.get(cacheKey);
    if (cached) {
      console.log('📦 Isochrone depuis le cache');
      return cached;
    }

    // Rate limiting check
    if (!this.checkRateLimit('isochrone')) {
      throw new Error('Limite de taux dépassée pour les isochrones');
    }

    return networkErrorHandler.handleApiCall(async () => {
      const token = await mapboxConfigService.getMapboxToken();
      
      const params = new URLSearchParams({
        access_token: token,
        contours_minutes: duration.toString(),
        polygons: 'true'
      });

      const url = `${this.baseUrl}/isochrone/v1/mapbox/${profile}/${center.join(',')}?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur isochrone: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache successful response
      offlineCacheService.set(cacheKey, data, { 
        maxAge: 20 * 60 * 1000, // 20 minutes
        priority: 'normal' 
      });
      
      return data;
    });
  }

  private checkRateLimit(operation: string): boolean {
    const key = `${operation}_${Math.floor(Date.now() / this.rateLimitWindow)}`;
    const current = this.rateLimitCache.get(key) || 0;
    
    if (current >= this.maxRequestsPerWindow) {
      console.warn(`⚠️ Limite de taux atteinte pour ${operation}`);
      return false;
    }
    
    this.rateLimitCache.set(key, current + 1);
    
    // Clean old entries
    for (const [cacheKey] of this.rateLimitCache) {
      const timestamp = parseInt(cacheKey.split('_').pop() || '0');
      if (timestamp < Math.floor(Date.now() / this.rateLimitWindow) - 1) {
        this.rateLimitCache.delete(cacheKey);
      }
    }
    
    return true;
  }

  clearCache(): void {
    offlineCacheService.clear();
    this.rateLimitCache.clear();
    console.log('🧹 Cache Mapbox vidé');
  }

  getStats() {
    return {
      cache: offlineCacheService.getStats(),
      rateLimits: Object.fromEntries(this.rateLimitCache)
    };
  }
}

export const secureMapboxProxy = new SecureMapboxProxy();