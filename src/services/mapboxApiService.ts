
import { TransportMode } from '@/types/map';
import { SearchResult } from '@/types/geosearch';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

interface SearchOptions {
  limit?: number;
  radius?: number;
  categories?: string[];
}

// Transport mode mapping for Mapbox
const getMapboxProfile = (transportMode: TransportMode): string => {
  const profileMap: Record<TransportMode, string> = {
    driving: 'driving',
    walking: 'walking',
    cycling: 'cycling',
    transit: 'walking',
    car: 'driving',
    bus: 'walking',
    train: 'walking'
  };
  
  return profileMap[transportMode] || 'walking';
};

export const mapboxApiService = {
  async initialize(): Promise<boolean> {
    try {
      if (!MAPBOX_TOKEN || !MAPBOX_TOKEN.startsWith('pk.')) {
        console.error('Token Mapbox invalide ou manquant');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur d\'initialisation Mapbox:', error);
      return false;
    }
  },

  async searchPlaces(
    query: string,
    center: [number, number],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 5, radius = 10 } = options;
      
      const bbox = this.calculateBoundingBox(center, radius);
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `proximity=${center[0]},${center[1]}&` +
        `limit=${limit}&` +
        `country=fr&` +
        `language=fr&` +
        `types=poi,address&` +
        `bbox=${bbox.join(',')}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        address: feature.place_name,
        coordinates: feature.center,
        type: 'place',
        category: feature.properties?.category || 'restaurant',
        distance: this.calculateDistance(center, feature.center),
        duration: Math.round(this.calculateDistance(center, feature.center) * 12)
      }));
    } catch (error) {
      console.error('Mapbox search error:', error);
      return [];
    }
  },

  async getDirections(
    origin: [number, number],
    destination: [number, number],
    transportMode: TransportMode
  ) {
    try {
      const profile = getMapboxProfile(transportMode);
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Directions API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.routes[0];
    } catch (error) {
      console.error('Directions error:', error);
      throw error;
    }
  },

  async createIsochrone(
    center: [number, number],
    duration: number,
    transportMode: TransportMode
  ) {
    try {
      const profile = getMapboxProfile(transportMode);
      const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${center[0]},${center[1]}?contours_minutes=${duration}&polygons=true&access_token=${MAPBOX_TOKEN}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Isochrone API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Isochrone error:', error);
      throw error;
    }
  },

  calculateDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  },

  calculateBoundingBox([lng, lat]: [number, number], radiusKm: number): [number, number, number, number] {
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));

    return [
      lng - lngDelta,
      lat - latDelta,
      lng + lngDelta,
      lat + latDelta
    ];
  }
};
