
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
      console.log('🔍 Recherche à proximité avec filtres:', filters);
      
      if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
        throw new Error('Position utilisateur invalide');
      }

      let searchQuery = this.buildSearchQuery(filters);
      
      const results = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
        limit: filters.aroundMeCount || 5,
        radius: filters.distance || 10,
        categories: filters.category ? [filters.category] : undefined
      });

      if (!Array.isArray(results)) {
        console.warn('Résultats API invalides:', results);
        return [];
      }

      return results.map(result => this.convertToSearchResult(result, userLocation, filters));
    } catch (error) {
      console.error('❌ Erreur de recherche géographique:', error);
      throw new Error(`Erreur de recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async searchByQuery(
    query: string,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): Promise<SearchResult[]> {
    try {
      if (!query || typeof query !== 'string' || !query.trim()) {
        throw new Error('Requête de recherche invalide');
      }

      if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
        throw new Error('Position utilisateur invalide');
      }

      const results = await mapboxApiService.searchPlaces(query.trim(), userLocation, {
        limit: 10,
        radius: filters.distance || 10
      });

      if (!Array.isArray(results)) {
        console.warn('Résultats API invalides:', results);
        return [];
      }

      return results.map(result => this.convertToSearchResult(result, userLocation, filters));
    } catch (error) {
      console.error('❌ Erreur de recherche par requête:', error);
      throw new Error(`Erreur de recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transport: TransportMode
  ) {
    try {
      if (!this.isValidCoordinates(origin) || !this.isValidCoordinates(destination)) {
        throw new Error('Coordonnées invalides pour le calcul d\'itinéraire');
      }

      return await mapboxApiService.getDirections(origin, destination, transport);
    } catch (error) {
      console.error('❌ Erreur de calcul d\'itinéraire:', error);
      throw new Error(`Erreur d'itinéraire: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private buildSearchQuery(filters: GeoSearchFilters): string {
    let query = (filters.query || '').trim();
    
    if (filters.category && !query) {
      query = filters.category;
    }
    
    if (filters.subcategory) {
      query = `${query} ${filters.subcategory}`.trim();
    }
    
    if (!query) {
      query = 'restaurant'; // Valeur par défaut sécurisée
    }
    
    return query;
  }

  private convertToSearchResult(
    mapboxResult: any,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): SearchResult {
    try {
      if (!mapboxResult || !mapboxResult.coordinates) {
        throw new Error('Résultat Mapbox invalide');
      }

      const distance = GeoCoordinates.calculateDistance(
        userLocation,
        mapboxResult.coordinates
      );

      const duration = this.estimateDuration(distance, filters.transport || 'walking');

      return {
        id: mapboxResult.id || `result-${Date.now()}-${Math.random()}`,
        name: mapboxResult.name || 'Lieu sans nom',
        address: mapboxResult.address || 'Adresse non disponible',
        coordinates: mapboxResult.coordinates,
        type: mapboxResult.category || 'point_of_interest',
        category: mapboxResult.category || filters.category || 'general',
        distance: Math.round(distance * 10) / 10,
        duration
      };
    } catch (error) {
      console.error('❌ Erreur conversion résultat:', error);
      // Retourner un résultat par défaut plutôt que de lever une erreur
      return {
        id: `error-${Date.now()}`,
        name: 'Lieu non disponible',
        address: 'Adresse non disponible',
        coordinates: userLocation,
        type: 'point_of_interest',
        category: 'general',
        distance: 0,
        duration: 0
      };
    }
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

  private isValidCoordinates(coords: any): coords is [number, number] {
    return Array.isArray(coords) && 
           coords.length === 2 && 
           typeof coords[0] === 'number' && 
           typeof coords[1] === 'number' &&
           !isNaN(coords[0]) && 
           !isNaN(coords[1]);
  }
}

export const geoSearchService = GeoSearchService.getInstance();
