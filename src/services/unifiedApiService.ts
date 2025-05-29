import { getMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';
import { captureMapboxError } from './monitoring';
import { trackSearchEvent } from './analytics';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';

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
  query?: string; // Rendre query optionnel
}

// Service unifié pour toutes les recherches
export const unifiedSearchService = {
  // Recherche principale avec tous les filtres
  async searchPlaces(params: UnifiedSearchParams): Promise<SearchPlace[]> {
    const token = getMapboxToken();
    
    try {
      console.log('Recherche unifiée avec paramètres:', params);
      
      // Construire la requête avec valeur par défaut
      let query = params.query || '';
      if (params.category && !query) {
        query = params.category;
      }
      if (params.subcategory) {
        query = `${query} ${params.subcategory}`.trim();
      }
      
      if (!query) {
        query = 'point of interest';
      }
      
      // Paramètres Mapbox
      const searchParams = new URLSearchParams({
        access_token: token,
        proximity: params.center.join(','),
        limit: params.aroundMeCount.toString(),
        country: 'fr',
        language: 'fr'
      });
      
      // Bbox pour le rayon
      if (params.distance) {
        const bbox = this.calculateBbox(params.center, params.distance, params.unit);
        searchParams.append('bbox', bbox.join(','));
      }
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        console.log('Aucun résultat trouvé pour:', query);
        return [];
      }
      
      // Traitement des résultats avec calcul de durée si nécessaire
      const results = await Promise.all(
        data.features.slice(0, params.aroundMeCount).map(async (feature: any, index: number) => {
          const coordinates: [number, number] = feature.center;
          const distance = this.calculateDistance(params.center, coordinates, params.unit);
          
          let duration: number | undefined;
          
          // Calculer la durée si maxDuration est spécifié
          if (params.maxDuration && params.maxDuration > 0) {
            try {
              const directions = await this.getDirections(
                params.center,
                coordinates,
                params.transport
              );
              duration = Math.round(directions.duration / 60);
              
              // Filtrer par durée maximale
              if (duration > params.maxDuration) {
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
      
      const validResults = results.filter(result => result !== null) as SearchPlace[];
      
      // Analytics
      trackSearchEvent({
        category: params.category || undefined,
        transport: params.transport,
        distance: params.distance,
        resultsCount: validResults.length
      });
      
      return validResults.sort((a, b) => {
        if (a.relevance && b.relevance) {
          return b.relevance - a.relevance;
        }
        return a.distance - b.distance;
      });
      
    } catch (error) {
      console.error('Erreur dans la recherche unifiée:', error);
      captureMapboxError(error as Error, {
        apiCall: 'unified-search',
        params,
        userLocation: params.center
      });
      
      // Fallback avec données mockées
      return this.generateMockResults(params);
    }
  },

  // Calculs d'itinéraires
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

  // Génération de données mockées en cas d'erreur API
  generateMockResults(params: UnifiedSearchParams): SearchPlace[] {
    const resultCount = params.aroundMeCount || 3;
    
    return Array.from({ length: resultCount }, (_, i) => ({
      id: `mock-result-${i}`,
      name: `${params.category || 'Lieu'} ${i + 1}`,
      address: `${123 + i} Rue d'Exemple, Paris`,
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
