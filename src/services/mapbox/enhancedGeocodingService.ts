
import { getMapboxToken } from '@/utils/mapboxConfig';
import { MapboxSearchResult, MapboxSearchOptions } from './types';

export class EnhancedGeocodingService {
  private baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  async searchPlaces(
    query: string,
    center: [number, number],
    options: MapboxSearchOptions = {}
  ): Promise<MapboxSearchResult[]> {
    try {
      const token = getMapboxToken();
      const {
        limit = 5,
        radius = 10,
        categories,
        language = 'fr',
        country = 'fr'
      } = options;

      // Construire l'URL avec paramètres optimisés
      const searchParams = new URLSearchParams({
        access_token: token,
        proximity: `${center[0]},${center[1]}`,
        limit: limit.toString(),
        country,
        language,
        types: 'poi,address',
        autocomplete: 'true'
      });

      // Ajouter la bounding box basée sur le rayon
      const radiusInDegrees = radius / 111.32; // Approximation 1° ≈ 111.32 km
      const bbox = [
        center[0] - radiusInDegrees,
        center[1] - radiusInDegrees,
        center[0] + radiusInDegrees,
        center[1] + radiusInDegrees
      ];
      searchParams.append('bbox', bbox.join(','));

      // Ajouter les catégories si spécifiées
      if (categories && categories.length > 0) {
        searchParams.append('category', categories.join(','));
      }

      const url = `${this.baseUrl}/${encodeURIComponent(query)}.json?${searchParams}`;
      
      console.log('🔍 Recherche Mapbox:', { query, center, options, url: url.substring(0, 100) + '...' });

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token Mapbox invalide ou expiré');
        } else if (response.status === 429) {
          throw new Error('Limite de taux API dépassée');
        }
        throw new Error(`Erreur API Mapbox: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📍 Résultats bruts Mapbox:', data.features?.length || 0);

      if (!data.features || data.features.length === 0) {
        console.log('⚠️ Aucun résultat trouvé, tentative avec recherche élargie');
        return this.fallbackSearch(query, center, options);
      }

      // Convertir et filtrer les résultats
      const results = data.features
        .filter((feature: any) => feature.geometry?.coordinates)
        .map((feature: any): MapboxSearchResult => {
          const coords = feature.geometry.coordinates;
          const distance = this.calculateDistance(center, coords);
          
          return {
            id: feature.id || `place-${Date.now()}-${Math.random()}`,
            name: feature.text || feature.properties?.name || 'Lieu sans nom',
            address: feature.place_name || feature.properties?.address || '',
            coordinates: [coords[0], coords[1]] as [number, number],
            category: this.extractCategory(feature),
            distance: Math.round(distance * 10) / 10,
            properties: feature.properties || {}
          };
        })
        .filter(result => result.distance <= radius) // Filtrer par rayon
        .sort((a, b) => a.distance - b.distance) // Trier par distance
        .slice(0, limit); // Limiter les résultats

      console.log('✅ Résultats traités:', results.length);
      return results;

    } catch (error) {
      console.error('❌ Erreur service de géocodage:', error);
      throw error;
    }
  }

  private async fallbackSearch(
    query: string,
    center: [number, number],
    options: MapboxSearchOptions
  ): Promise<MapboxSearchResult[]> {
    try {
      // Recherche sans catégorie spécifique
      const fallbackOptions = { ...options, categories: undefined };
      const token = getMapboxToken();
      
      const searchParams = new URLSearchParams({
        access_token: token,
        proximity: `${center[0]},${center[1]}`,
        limit: (options.limit || 5).toString(),
        country: 'fr',
        language: 'fr',
        types: 'poi,address,place'
      });

      const url = `${this.baseUrl}/${encodeURIComponent(query)}.json?${searchParams}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      return (data.features || [])
        .filter((feature: any) => feature.geometry?.coordinates)
        .slice(0, options.limit || 5)
        .map((feature: any): MapboxSearchResult => ({
          id: feature.id || `fallback-${Date.now()}-${Math.random()}`,
          name: feature.text || 'Lieu',
          address: feature.place_name || '',
          coordinates: feature.geometry.coordinates as [number, number],
          category: 'general',
          distance: this.calculateDistance(center, feature.geometry.coordinates),
          properties: feature.properties || {}
        }));

    } catch (error) {
      console.error('❌ Erreur recherche fallback:', error);
      return [];
    }
  }

  private extractCategory(feature: any): string {
    if (feature.properties?.category) {
      return feature.properties.category;
    }
    
    const categories = feature.properties?.categories || [];
    if (categories.length > 0) {
      return categories[0];
    }
    
    // Déduire la catégorie du type de lieu
    const placeType = feature.place_type?.[0];
    switch (placeType) {
      case 'poi':
        return 'point_of_interest';
      case 'address':
        return 'address';
      default:
        return 'general';
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

export const enhancedGeocodingService = new EnhancedGeocodingService();
