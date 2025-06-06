
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
      
      if (!this.isValidCoordinates(userLocation)) {
        throw new Error('Position utilisateur invalide');
      }

      let searchQuery = this.buildSearchQuery(filters);
      console.log('📝 Requête construite:', searchQuery);
      
      const results = await mapboxApiService.searchPlaces(searchQuery, userLocation, {
        limit: filters.aroundMeCount || 10,
        radius: filters.distance || 10,
        categories: filters.category ? [filters.category] : undefined
      });

      if (!Array.isArray(results)) {
        console.warn('Résultats API invalides:', results);
        return [];
      }

      console.log('📍 Résultats bruts de l\'API:', results.length);
      const processedResults = results.map(result => this.convertToSearchResult(result, userLocation, filters));
      console.log('✅ Résultats traités:', processedResults.length);
      
      return processedResults;
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

      if (!this.isValidCoordinates(userLocation)) {
        throw new Error('Position utilisateur invalide');
      }

      console.log('🔍 Recherche par requête:', query, 'Position:', userLocation);

      const results = await mapboxApiService.searchPlaces(query.trim(), userLocation, {
        limit: 15,
        radius: filters.distance || 10,
        categories: filters.category ? [filters.category] : undefined
      });

      if (!Array.isArray(results)) {
        console.warn('Résultats API invalides:', results);
        return [];
      }

      console.log('📍 Résultats bruts de l\'API pour la requête:', results.length);
      const processedResults = results.map(result => this.convertToSearchResult(result, userLocation, filters));
      
      return processedResults;
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

      console.log('🗺️ Calcul d\'itinéraire:', { origin, destination, transport });
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
      // Valeurs par défaut basées sur les catégories populaires
      const defaultQueries = ['restaurant', 'café', 'magasin', 'pharmacie', 'banque'];
      query = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
    }
    
    return query;
  }

  private convertToSearchResult(
    mapboxResult: any,
    userLocation: [number, number],
    filters: GeoSearchFilters
  ): SearchResult {
    try {
      if (!mapboxResult) {
        throw new Error('Résultat Mapbox vide');
      }

      // Extraire les coordonnées de différentes structures possibles
      let coordinates: [number, number];
      if (mapboxResult.coordinates) {
        coordinates = mapboxResult.coordinates;
      } else if (mapboxResult.geometry?.coordinates) {
        coordinates = mapboxResult.geometry.coordinates;
      } else if (mapboxResult.center) {
        coordinates = mapboxResult.center;
      } else {
        throw new Error('Coordonnées non trouvées dans le résultat');
      }

      if (!this.isValidCoordinates(coordinates)) {
        throw new Error('Coordonnées invalides dans le résultat');
      }

      const distance = GeoCoordinates.calculateDistance(userLocation, coordinates);
      const duration = this.estimateDuration(distance, filters.transport || 'walking');

      // Extraire le nom de différentes sources possibles
      const name = mapboxResult.name || 
                   mapboxResult.text || 
                   mapboxResult.place_name?.split(',')[0] || 
                   'Lieu sans nom';

      // Extraire l'adresse
      const address = mapboxResult.address || 
                     mapboxResult.place_name || 
                     mapboxResult.properties?.address || 
                     'Adresse non disponible';

      return {
        id: mapboxResult.id || `result-${Date.now()}-${Math.random()}`,
        name,
        address,
        coordinates,
        type: mapboxResult.category || mapboxResult.properties?.category || 'point_of_interest',
        category: mapboxResult.category || filters.category || 'general',
        distance: Math.round(distance * 10) / 10,
        duration
      };
    } catch (error) {
      console.error('❌ Erreur conversion résultat:', error, 'Résultat brut:', mapboxResult);
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
           !isNaN(coords[1]) &&
           coords[0] >= -180 && coords[0] <= 180 && // longitude
           coords[1] >= -90 && coords[1] <= 90; // latitude
  }
}

export const geoSearchService = GeoSearchService.getInstance();
