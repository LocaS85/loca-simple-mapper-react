
import { getMapboxToken } from '@/utils/mapboxConfig';
import { MapboxSearchResult, MapboxSearchOptions } from './types';

class EnhancedGeocodingService {
  private token: string;

  constructor() {
    this.token = getMapboxToken();
  }

  async searchPlaces(
    query: string,
    center: [number, number],
    options: MapboxSearchOptions = {}
  ): Promise<MapboxSearchResult[]> {
    const {
      limit = 10,
      radius = 10,
      language = 'fr',
      country = 'fr',
      categories
    } = options;

    const searchParams = new URLSearchParams({
      access_token: this.token,
      proximity: center.join(','),
      limit: limit.toString(),
      country,
      language,
      types: 'poi,address',
      autocomplete: 'true'
    });

    if (radius > 0) {
      const bbox = this.calculateBbox(center, radius);
      searchParams.append('bbox', bbox.join(','));
    }

    if (categories && categories.length > 0) {
      searchParams.append('category', categories.join(','));
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.features?.map((feature: any, index: number) => ({
        id: feature.id || `result-${index}`,
        name: feature.text || feature.place_name,
        address: feature.place_name,
        coordinates: feature.center as [number, number],
        category: this.determineCategory(feature),
        distance: this.calculateDistance(center, feature.center),
        relevance: feature.relevance,
        properties: feature.properties || {}
      })) || [];
    } catch (error) {
      console.error('Enhanced geocoding error:', error);
      throw error;
    }
  }

  private calculateBbox(center: [number, number], radiusKm: number): [number, number, number, number] {
    const radiusInDegrees = radiusKm / 111.32;
    return [
      center[0] - radiusInDegrees,
      center[1] - radiusInDegrees,
      center[0] + radiusInDegrees,
      center[1] + radiusInDegrees
    ];
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371;
    const dLat = (point2[1] - point1[1]) * Math.PI / 180;
    const dLon = (point2[0] - point1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private determineCategory(feature: any): string {
    if (feature.properties?.category) {
      return feature.properties.category;
    }
    
    const placeType = feature.place_type?.[0];
    const categoryMap: Record<string, string> = {
      'poi': 'Point d\'intérêt',
      'address': 'Adresse',
      'place': 'Lieu'
    };
    
    return categoryMap[placeType] || 'Lieu';
  }
}

export const enhancedGeocodingService = new EnhancedGeocodingService();
