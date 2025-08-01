import { SearchResult } from '@/types/geosearch';
import { secureMapboxService } from '../secureMapboxService';

interface GeocodingOptions {
  limit?: number;
  radius?: number;
  language?: string;
  categories?: string[];
}

export const enhancedGeocodingService = {
  async searchPlaces(
    query: string,
    center: [number, number],
    options: GeocodingOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10, radius = 50 } = options;
      
      // Utilisation du service sécurisé
      const results = await secureMapboxService.searchPlaces(query, center, {
        limit,
        radius
      });
      
      // Enrichissement des résultats
      return results.map((result) => ({
        ...result,
        category: this.extractCategoryFromContext(result) || 'general',
        duration: Math.round(result.distance * 15) // 15min par km à pied
      })).sort((a, b) => a.distance - b.distance);
      
    } catch (error) {
      console.error('Enhanced geocoding error:', error);
      return [];
    }
  },

  extractCategoryFromContext(result: SearchResult): string | null {
    // Analyser le nom du lieu pour déduire la catégorie
    const placeName = result.address?.toLowerCase() || result.name?.toLowerCase() || '';
    return this.inferCategoryFromName(placeName);
  },

  inferCategoryFromName(placeName: string): string | null {
    if (placeName.includes('restaurant') || placeName.includes('café')) {
      return 'restaurant';
    }
    if (placeName.includes('pharmacie')) {
      return 'health';
    }
    if (placeName.includes('supermarché') || placeName.includes('magasin')) {
      return 'shopping';
    }
    if (placeName.includes('hôtel')) {
      return 'lodging';
    }
    return 'place';
  },

  calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    return secureMapboxService.calculateDistance(coord1, coord2);
  },

  calculateBoundingBox(center: [number, number], radiusKm: number): [number, number, number, number] {
    return secureMapboxService.calculateBoundingBox(center, radiusKm);
  }
};