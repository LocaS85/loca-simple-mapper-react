
import { getMapboxTokenSync } from '@/utils/mapboxConfig';
import { MapboxSearchResult, MapboxSearchOptions } from './types';

export class MapboxGeocodingService {
  private token: string;

  constructor() {
    this.token = getMapboxTokenSync() || '';
  }

  async searchPlaces(
    query: string, 
    center: [number, number], 
    options: MapboxSearchOptions = {}
  ): Promise<MapboxSearchResult[]> {
    const { limit = 10, radius = 10 } = options;

    // Améliorer la requête de recherche pour de meilleurs résultats
    let searchQuery = query;
    if (!searchQuery || searchQuery === 'point of interest') {
      searchQuery = 'restaurant OR cafe OR commerce OR pharmacie OR boulangerie';
    }

    const searchParams = new URLSearchParams({
      access_token: this.token,
      proximity: center.join(','),
      limit: limit.toString(),
      country: 'fr',
      language: 'fr',
      types: 'poi,address',
      autocomplete: 'true'
    });

    if (radius > 0) {
      const bbox = this.calculateBbox(center, radius);
      searchParams.append('bbox', bbox.join(','));
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?${searchParams}`;
    
    try {
      console.log('🔍 Recherche Mapbox avec requête améliorée:', searchQuery);
      console.log('📍 Center utilisé:', center);
      const response = await fetch(url);
      
      if (response.status === 401) {
        throw new Error('Token Mapbox invalide ou expiré');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur API Mapbox: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📍 Résultats Mapbox reçus:', data.features?.length || 0);
      
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

  private calculateBbox(center: [number, number], radiusKm: number): [number, number, number, number] {
    const radiusInDegrees = radiusKm / 111.32;
    return [
      center[0] - radiusInDegrees,
      center[1] - radiusInDegrees,
      center[0] + radiusInDegrees,
      center[1] + radiusInDegrees
    ];
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
    
    return categoryMap[placeType] || 'Lieu';
  }
}
