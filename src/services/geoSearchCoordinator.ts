
import { mapboxApiService } from './mapboxApiService';
import { TransportMode, SearchResult, GeoSearchFilters } from '@/types/unified';

class GeoSearchCoordinator {
  private static instance: GeoSearchCoordinator;

  static getInstance(): GeoSearchCoordinator {
    if (!GeoSearchCoordinator.instance) {
      GeoSearchCoordinator.instance = new GeoSearchCoordinator();
    }
    return GeoSearchCoordinator.instance;
  }

  async searchPlaces(
    query: string,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): Promise<SearchResult[]> {
    try {
      const results = await mapboxApiService.searchPlaces(query, userLocation, {
        limit: filters.aroundMeCount || 5,
        radius: filters.distance,
        categories: filters.category ? [filters.category] : undefined
      });

      return results.map(result => ({
        id: result.id,
        name: result.name,
        address: result.address,
        coordinates: result.coordinates,
        type: this.extractPlaceType(result),
        category: result.category || filters.category || 'general',
        distance: result.distance,
        duration: this.estimateDuration(result.distance, filters.transport)
      }));
    } catch (error) {
      console.error('Erreur de recherche coordonnée:', error);
      throw error;
    }
  }

  async calculateRoute(
    origin: [number, number],
    destination: [number, number],
    transport: TransportMode
  ) {
    try {
      return await mapboxApiService.getDirections(origin, destination, transport);
    } catch (error) {
      console.error('Erreur de calcul d\'itinéraire:', error);
      throw error;
    }
  }

  private extractPlaceType(result: any): string {
    if (result.properties?.category) {
      return result.properties.category;
    }
    return result.category || 'point_of_interest';
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

export const geoSearchCoordinator = GeoSearchCoordinator.getInstance();
