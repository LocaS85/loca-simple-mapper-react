
import { getMapboxTokenSync } from '@/utils/mapboxConfig';
import { TransportMode } from '@/types';

export class MapboxIsochroneService {
  private token: string;

  constructor() {
    this.token = getMapboxTokenSync() || '';
  }

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode = 'walking'
  ): Promise<any> {
    const profile = this.getMapboxProfile(transportMode);
    
    const params = new URLSearchParams({
      access_token: this.token,
      contours_minutes: duration.toString(),
      polygons: 'true',
      denoise: '1'
    });

    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center.join(',')}?${params}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur Isochrone API: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur lors de la création d\'isochrone:', error);
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
