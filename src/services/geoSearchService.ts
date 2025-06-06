
import { mapboxApiService } from './mapboxApiService';
import { TransportMode } from '@/lib/data/transportModes';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { GeoCoordinates } from '@/utils/geoCoordinates';

export class GeoSearchService {
  private static instance: GeoSearchService;

  static getInstance(): GeoSearchService {
    if (!GeoSearchService.instance) {
      GeoSearchService.instance = new GeoSearchService();
    }
    return GeoSearchService.instance;
  }

  async searchNearby(
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): Promise<SearchResult[]> {
    try {
      console.log('🔍 Recherche avec filtres:', filters);
      
      let searchQuery = this.buildSearchQuery(filters);
      
      const results = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
        limit: filters.aroundMeCount || 5,
        radius: filters.distance,
        categories: filters.category ? [filters.category] : undefined
      });

      return results.map(result => this.convertToSearchResult(result, userLocation, filters));
    } catch (error) {
      console.error('❌ Erreur de recherche géographique:', error);
      throw error;
    }
  }

  async searchByQuery(
    query: string,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): Promise<SearchResult[]> {
    try {
      const results = await mapboxApiService.searchPlaces(query, userLocation, {
        limit: 10,
        radius: filters.distance
      });

      return results.map(result => this.convertToSearchResult(result, userLocation, filters));
    } catch (error) {
      console.error('❌ Erreur de recherche par requête:', error);
      throw error;
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transport: TransportMode
  ) {
    try {
      return await mapboxApiService.getDirections(origin, destination, transport);
    } catch (error) {
      console.error('❌ Erreur de calcul d\'itinéraire:', error);
      throw error;
    }
  }

  private buildSearchQuery(filters: GeoSearchFilters): string {
    let query = filters.query || '';
    
    if (filters.category && !query) {
      query = filters.category;
    }
    
    if (filters.subcategory) {
      query = `${query} ${filters.subcategory}`.trim();
    }
    
    if (!query) {
      query = 'restaurant'; // Valeur par défaut
    }
    
    return query;
  }

  private convertToSearchResult(
    mapboxResult: any,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): SearchResult {
    const distance = GeoCoordinates.calculateDistance(
      userLocation,
      mapboxResult.coordinates
    );

    const duration = this.estimateDuration(distance, filters.transport);

    return {
      id: mapboxResult.id,
      name: mapboxResult.name,
      address: mapboxResult.address,
      coordinates: mapboxResult.coordinates,
      type: mapboxResult.category || 'point_of_interest',
      category: mapboxResult.category || filters.category || 'general',
      distance: Math.round(distance * 10) / 10,
      duration
    };
  }

  private estimateDuration(distance: number, transport: TransportMode): number {
    const speeds = {
      walking: 5, // km/h
      cycling: 15,
      car: 30,
      bus: 20,
      train: 40
    };
    
    const speed = speeds[transport] || speeds.walking;
    return Math.round((distance / speed) * 60); // minutes
  }
}

export const geoSearchService = GeoSearchService.getInstance();
