import { supabase } from '@/integrations/supabase/client';
import { TransportMode } from '@/types/map';
import { SearchResult } from '@/types/geosearch';

interface SecureMapboxConfig {
  timeout?: number;
  retries?: number;
  cacheDuration?: number;
}

interface SearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}

class SecureMapboxService {
  private static instance: SecureMapboxService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly config: SecureMapboxConfig;

  constructor(config: SecureMapboxConfig = {}) {
    this.config = {
      timeout: 10000,
      retries: 2,
      cacheDuration: 5 * 60 * 1000, // 5 minutes
      ...config
    };
  }

  static getInstance(config?: SecureMapboxConfig): SecureMapboxService {
    if (!SecureMapboxService.instance) {
      SecureMapboxService.instance = new SecureMapboxService(config);
    }
    return SecureMapboxService.instance;
  }

  private async makeSecureRequest(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.config.cacheDuration!) {
      console.log('📦 Using cached Mapbox response');
      return cached.data;
    }

    try {
      const { data, error } = await supabase.functions.invoke('mapbox-proxy', {
        body: { endpoint }
      });

      if (error) {
        throw new Error(`Mapbox proxy error: ${error.message}`);
      }

      // Cache successful responses
      if (data && !data.error) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;

    } catch (error) {
      console.error('🔴 Secure Mapbox request failed:', error);
      throw error;
    }
  }

  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 5, radius = 10 } = options;
      
      const bbox = this.calculateBoundingBox(center, radius);
      
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address&` +
        `bbox=${bbox.join(',')}`;

      const data = await this.makeSecureRequest(endpoint);
      
      if (!data.features) {
        console.warn('⚠️ No features in Mapbox response');
        return [];
      }

      return data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        address: feature.place_name,
        coordinates: feature.center,
        type: 'place',
        category: feature.properties?.category || 'restaurant',
        distance: this.calculateDistance(center, feature.center),
        duration: Math.round(this.calculateDistance(center, feature.center) * 12)
      }));
    } catch (error) {
      console.error('🔴 Mapbox search error:', error);
      return [];
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode
  ) {
    try {
      const profile = this.getMapboxProfile(transportMode);
      const endpoint = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson`;
      
      const data = await this.makeSecureRequest(endpoint);
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No routes found');
      }
      
      return data.routes[0];
    } catch (error) {
      console.error('🔴 Directions error:', error);
      throw error;
    }
  }

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode
  ) {
    try {
      const profile = this.getMapboxProfile(transportMode);
      const endpoint = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center[0]},${center[1]}?contours_minutes=${duration}&polygons=true`;
      
      const data = await this.makeSecureRequest(endpoint);
      return data;
    } catch (error) {
      console.error('🔴 Isochrone error:', error);
      throw error;
    }
  }

  async geocodeForward(query: string, proximity?: [number, number]) {
    try {
      let endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=fr&language=fr`;
      
      if (proximity) {
        endpoint += `&proximity=${proximity[0]},${proximity[1]}`;
      }
      
      const data = await this.makeSecureRequest(endpoint);
      return data;
    } catch (error) {
      console.error('🔴 Geocoding error:', error);
      throw error;
    }
  }

  async geocodeReverse(coordinates: [number, number]) {
    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?country=fr&language=fr`;
      
      const data = await this.makeSecureRequest(endpoint);
      return data;
    } catch (error) {
      console.error('🔴 Reverse geocoding error:', error);
      throw error;
    }
  }

  private getMapboxProfile(transportMode: TransportMode): string {
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
  }

  calculateDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  }

  calculateBoundingBox([lng, lat]: [number, number], radiusKm: number): [number, number, number, number] {
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));

    return [
      lng - lngDelta,
      lat - latDelta,
      lng + lngDelta,
      lat + latDelta
    ];
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Mapbox cache cleared');
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const secureMapboxService = SecureMapboxService.getInstance();