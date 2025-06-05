
import { getMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';
import { MapboxSearchResult, MapboxDirectionsResult } from './mapbox/types';

class MapboxApiService {
  private token: string;
  private initialized = false;

  constructor() {
    this.token = '';
  }

  async initialize(): Promise<boolean> {
    try {
      this.token = getMapboxToken();
      this.initialized = true;
      console.log('✅ Service API Mapbox initialisé');
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'initialisation API Mapbox:', error);
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
    if (!this.initialized) {
      await this.initialize();
    }

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
    const radiusInDegrees = radius / 111.32;
    const bbox = [
      center[0] - radiusInDegrees,
      center[1] - radiusInDegrees,
      center[0] + radiusInDegrees,
      center[1] + radiusInDegrees
    ];
    searchParams.append('bbox', bbox.join(','));

    if (categories && categories.length > 0) {
      searchParams.append('category', categories.join(','));
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      return data.features?.map((feature: any): MapboxSearchResult => ({
        id: feature.id || `place-${Date.now()}-${Math.random()}`,
        name: feature.text || feature.properties?.name || 'Lieu sans nom',
        address: feature.place_name || '',
        coordinates: feature.geometry.coordinates as [number, number],
        category: this.extractCategory(feature),
        distance: this.calculateDistance(center, feature.geometry.coordinates),
        properties: feature.properties || {}
      })) || [];

    } catch (error) {
      console.error('❌ Erreur recherche API:', error);
      throw error;
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode = 'walking'
  ): Promise<MapboxDirectionsResult | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    const profile = this.getMapboxProfile(transportMode);
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${this.token}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur directions: ${response.status}`);
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
      console.error('❌ Erreur directions API:', error);
      throw error;
    }
  }

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode = 'walking'
  ): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }

    const profile = this.getMapboxProfile(transportMode);
    
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center[0]},${center[1]}?contours_minutes=${duration}&polygons=true&access_token=${this.token}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur isochrone: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur isochrone API:', error);
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

export const mapboxApiService = new MapboxApiService();
