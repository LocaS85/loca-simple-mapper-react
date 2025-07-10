
import { getMapboxTokenSync } from '@/utils/mapboxConfig';
import { TransportMode } from '@/types';
import { MapboxDirectionsResult } from './types';

export class MapboxDirectionsService {
  private token: string;

  constructor() {
    this.token = getMapboxTokenSync() || '';
  }

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode = 'walking'
  ): Promise<MapboxDirectionsResult> {
    const profile = this.getMapboxProfile(transportMode);
    const coordinates = `${origin.join(',')};${destination.join(',')}`;
    
    const params = new URLSearchParams({
      access_token: this.token,
      geometries: 'geojson',
      overview: 'full',
      steps: 'true'
    });

    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 401) {
        throw new Error('Token Mapbox invalide pour les directions');
      }
      
      if (!response.ok) {
        throw new Error(`Erreur Directions API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('Aucun itinéraire trouvé');
      }
      
      return {
        geometry: data.routes[0].geometry,
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
        steps: data.routes[0].legs?.[0]?.steps || []
      };
      
    } catch (error) {
      console.error('Erreur lors du calcul d\'itinéraire:', error);
      throw error;
    }
  }

  private getMapboxProfile(transportMode: TransportMode): string {
    const profileMap: Record<string, string> = {
      'car': 'driving',
      'driving': 'driving',
      'walking': 'walking',
      'cycling': 'cycling',
      'bus': 'driving',
      'train': 'driving',
      'transit': 'driving'
    };
    return profileMap[transportMode] || 'driving';
  }
}
