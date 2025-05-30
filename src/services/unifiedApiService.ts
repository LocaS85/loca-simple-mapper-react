import { getMapboxToken, isMapboxTokenValid, validateMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';
import { trackSearchEvent } from './analytics';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';
import { filterSyncService } from '@/store/filterSync';
import { apiErrorHandler, ApiError } from './apiErrorHandler';

export interface SearchPlace {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  category: string;
  distance: number;
  duration?: number;
  relevance?: number;
}

export interface UnifiedSearchParams extends UnifiedFilters {
  center: [number, number];
}

// Service unifié pour toutes les recherches avec gestion d'erreurs améliorée
export const unifiedSearchService = {
  // Vérification préalable du token
  async validateToken(): Promise<boolean> {
    if (!isMapboxTokenValid()) {
      return false;
    }
    
    try {
      const token = getMapboxToken();
      return await validateMapboxToken(token);
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      return false;
    }
  },

  // Recherche principale avec gestion d'erreurs robuste
  async searchPlaces(params: UnifiedSearchParams): Promise<SearchPlace[]> {
    // Vérifier le token avant toute requête
    const tokenValid = await this.validateToken();
    if (!tokenValid) {
      console.warn('Token Mapbox invalide, retour de données mockées');
      return this.generateMockResults(params);
    }

    const token = getMapboxToken();
    
    // Valider les paramètres
    const validatedParams = filterSyncService.prepareApiParams(params, params.center);
    if (!validatedParams) {
      console.warn('Paramètres de recherche invalides:', params);
      return this.generateMockResults(params);
    }
    
    const searchOperation = async (): Promise<SearchPlace[]> => {
      console.log('Recherche unifiée avec paramètres validés:', validatedParams);
      
      // Construire la requête avec fallback
      let query = validatedParams.query || '';
      if (validatedParams.category && !query) {
        query = validatedParams.category;
      }
      if (validatedParams.subcategory) {
        query = `${query} ${validatedParams.subcategory}`.trim();
      }
      
      if (!query) {
        query = 'point of interest';
      }
      
      // Paramètres Mapbox optimisés
      const searchParams = new URLSearchParams({
        access_token: token,
        proximity: validatedParams.center.join(','),
        limit: Math.min(validatedParams.aroundMeCount, 10).toString(),
        country: 'fr',
        language: 'fr'
      });
      
      // Bbox pour le rayon avec validation
      if (validatedParams.distance && validatedParams.distance > 0) {
        const bbox = this.calculateBbox(validatedParams.center, validatedParams.distance, validatedParams.unit);
        searchParams.append('bbox', bbox.join(','));
      }
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;
      
      const response = await fetch(url);
      
      if (response.status === 401) {
        throw new ApiError('Token Mapbox invalide ou expiré', 401);
      }
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        console.log('Aucun résultat trouvé pour:', query);
        return [];
      }
      
      // Traitement des résultats avec gestion des erreurs
      const results = await Promise.allSettled(
        data.features.slice(0, validatedParams.aroundMeCount).map(async (feature: any, index: number) => {
          const coordinates: [number, number] = feature.center;
          const distance = this.calculateDistance(validatedParams.center, coordinates, validatedParams.unit);
          
          let duration: number | undefined;
          
          // Calculer la durée si nécessaire avec timeout
          if (validatedParams.maxDuration && validatedParams.maxDuration > 0) {
            try {
              const directions = await Promise.race([
                this.getDirections(validatedParams.center, coordinates, validatedParams.transport),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
              ]) as any;
              
              duration = Math.round(directions.duration / 60);
              
              // Filtrer par durée maximale
              if (duration > validatedParams.maxDuration) {
                return null;
              }
            } catch (error) {
              console.warn('Impossible de calculer la durée pour:', feature.place_name);
            }
          }
          
          return {
            id: feature.id || `result-${index}`,
            name: feature.text || feature.place_name,
            address: feature.place_name,
            coordinates,
            category: this.determineCategory(feature),
            distance: Math.round(distance * 10) / 10,
            duration,
            relevance: feature.relevance
          };
        })
      );
      
      // Filtrer les résultats réussis
      const validResults = results
        .filter((result): result is PromiseFulfilledResult<SearchPlace | null> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value as SearchPlace);
      
      // Analytics
      trackSearchEvent({
        category: validatedParams.category || undefined,
        transport: validatedParams.transport,
        distance: validatedParams.distance,
        resultsCount: validResults.length
      });
      
      return validResults.sort((a, b) => {
        if (a.relevance && b.relevance) {
          return b.relevance - a.relevance;
        }
        return a.distance - b.distance;
      });
    };

    try {
      // Utiliser retry avec backoff pour les erreurs récupérables
      return await apiErrorHandler.retryWithBackoff(searchOperation, 2, 1000);
      
    } catch (error) {
      const apiError = apiErrorHandler.handleMapboxError(error, {
        apiCall: 'unified-search',
        params: validatedParams,
        userLocation: params.center
      });
      
      console.error('Erreur dans la recherche unifiée:', apiError);
      
      // Fallback avec données mockées pour erreurs de token ou réseau
      if (apiError.statusCode === 401 || apiError.statusCode === 0) {
        return this.generateMockResults(params);
      }
      
      throw apiError;
    }
  },

  // Calculs d'itinéraires avec gestion d'erreurs
  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode
  ) {
    const token = getMapboxToken();
    const profile = this.getMapboxProfile(transportMode);
    
    const coordinates = `${origin.join(',')};${destination.join(',')}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`;
    
    const params = new URLSearchParams({
      access_token: token,
      geometries: 'geojson',
      overview: 'full'
    });
    
    const response = await fetch(`${url}?${params}`);
    
    if (response.status === 401) {
      throw new ApiError('Token Mapbox invalide pour les directions', 401);
    }
    
    if (!response.ok) {
      throw new Error(`Directions API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('Aucun itinéraire trouvé');
    }
    
    return {
      geometry: data.routes[0].geometry,
      distance: data.routes[0].distance,
      duration: data.routes[0].duration
    };
  },

  // Utilitaires
  calculateDistance(point1: [number, number], point2: [number, number], unit: 'km' | 'mi'): number {
    const R = unit === 'km' ? 6371 : 3959;
    const dLat = (point2[1] - point1[1]) * Math.PI / 180;
    const dLon = (point2[0] - point1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  calculateBbox(center: [number, number], radius: number, unit: 'km' | 'mi'): [number, number, number, number] {
    const radiusInDegrees = unit === 'km' ? radius / 111.32 : radius / 69.17;
    return [
      center[0] - radiusInDegrees,
      center[1] - radiusInDegrees,
      center[0] + radiusInDegrees,
      center[1] + radiusInDegrees
    ];
  },

  getMapboxProfile(transportMode: TransportMode): string {
    const profileMap: Record<TransportMode, string> = {
      'car': 'driving',
      'walking': 'walking',
      'cycling': 'cycling',
      'bus': 'driving',
      'train': 'driving'
    };
    return profileMap[transportMode] || 'driving';
  },

  determineCategory(feature: any): string {
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
    
    return categoryMap[placeType] || 'Inconnu';
  },

  // Génération de données mockées améliorées
  generateMockResults(params: UnifiedSearchParams): SearchPlace[] {
    const resultCount = Math.min(params.aroundMeCount || 3, 5);
    
    return Array.from({ length: resultCount }, (_, i) => ({
      id: `mock-result-${i}`,
      name: `${params.category || 'Lieu'} ${i + 1}`,
      address: `${123 + i} Rue d'Exemple, France`,
      coordinates: [
        params.center[0] + (Math.random() * 0.02 - 0.01),
        params.center[1] + (Math.random() * 0.02 - 0.01)
      ] as [number, number],
      category: params.category || 'général',
      distance: Math.round(Math.random() * params.distance * 10) / 10,
      duration: Math.round(Math.random() * 30)
    }));
  }
};
