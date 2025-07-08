import { supabase } from '@/integrations/supabase/client';

class MapboxConfigService {
  private static instance: MapboxConfigService;
  private tokenCache: string | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): MapboxConfigService {
    if (!MapboxConfigService.instance) {
      MapboxConfigService.instance = new MapboxConfigService();
    }
    return MapboxConfigService.instance;
  }

  async getMapboxToken(): Promise<string> {
    // Vérifier le cache
    if (this.tokenCache && Date.now() < this.cacheExpiry) {
      return this.tokenCache;
    }

    try {
      // Récupérer le token via l'Edge Function
      const { data, error } = await supabase.functions.invoke('mapbox-config');
      
      if (error) {
        throw new Error(`Failed to get Mapbox token: ${error.message}`);
      }

      if (!data?.token) {
        throw new Error('No token received from Mapbox config service');
      }

      // Mettre en cache le token
      this.tokenCache = data.token;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      console.log('✅ Token Mapbox récupéré et mis en cache');
      return data.token;

    } catch (error) {
      console.error('❌ Erreur récupération token Mapbox:', error);
      
      // Fallback vers localStorage
      const localToken = localStorage.getItem('MAPBOX_ACCESS_TOKEN');
      if (localToken && localToken.startsWith('pk.')) {
        console.log('🔄 Utilisation du token local en fallback');
        return localToken;
      }

      throw new Error('No valid Mapbox token available');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    if (!token || !token.startsWith('pk.')) {
      return false;
    }

    try {
      // Test simple avec l'API Mapbox
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  saveTokenLocally(token: string): void {
    if (!token || !token.startsWith('pk.')) {
      throw new Error('Invalid token format');
    }
    localStorage.setItem('MAPBOX_ACCESS_TOKEN', token);
    this.tokenCache = token;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
  }

  clearCache(): void {
    this.tokenCache = null;
    this.cacheExpiry = 0;
  }
}

export const mapboxConfigService = MapboxConfigService.getInstance();