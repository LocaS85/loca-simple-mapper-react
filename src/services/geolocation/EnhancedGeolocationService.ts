import { CoordinatesPair } from '@/types/unified';

interface LocationEntry {
  coordinates: CoordinatesPair;
  accuracy: number;
  timestamp: number;
  source: 'gps' | 'network' | 'ip' | 'manual';
  quality: number; // 0-100 score
  context?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackToIP?: boolean;
  requireHighQuality?: boolean;
}

interface GeolocationContext {
  city: string;
  country: string;
  region: string;
  timezone: string;
  countryCode: string;
}

export class EnhancedGeolocationService {
  private static instance: EnhancedGeolocationService;
  private locationHistory: LocationEntry[] = [];
  private maxHistorySize = 50;
  private storageKey = 'geolocation-history';
  private currentLocation: LocationEntry | null = null;
  private ipFallbackServices = [
    'https://ipapi.co/json/',
    'https://ip-api.com/json/',
    'https://ipinfo.io/json'
  ];

  static getInstance(): EnhancedGeolocationService {
    if (!EnhancedGeolocationService.instance) {
      EnhancedGeolocationService.instance = new EnhancedGeolocationService();
      EnhancedGeolocationService.instance.loadHistory();
    }
    return EnhancedGeolocationService.instance;
  }

  async getCurrentPosition(options: GeolocationOptions = {}): Promise<LocationEntry> {
    const {
      enableHighAccuracy = true,
      timeout = 15000,
      maximumAge = 300000, // 5 minutes
      fallbackToIP = true,
      requireHighQuality = false
    } = options;

    console.log('🌍 Démarrage géolocalisation avancée...');

    try {
      // Try GPS first
      const gpsLocation = await this.getGPSLocation({
        enableHighAccuracy,
        timeout,
        maximumAge
      });

      if (gpsLocation && this.isLocationValid(gpsLocation, requireHighQuality)) {
        console.log('✅ GPS géolocalisation réussie');
        await this.enrichLocationContext(gpsLocation);
        this.addToHistory(gpsLocation);
        this.currentLocation = gpsLocation;
        return gpsLocation;
      }
    } catch (error) {
      console.warn('⚠️ GPS géolocalisation échouée:', error);
    }

    // Fallback to network/WiFi geolocation
    try {
      const networkLocation = await this.getNetworkLocation();
      if (networkLocation && this.isLocationValid(networkLocation, false)) {
        console.log('✅ Network géolocalisation réussie');
        await this.enrichLocationContext(networkLocation);
        this.addToHistory(networkLocation);
        this.currentLocation = networkLocation;
        return networkLocation;
      }
    } catch (error) {
      console.warn('⚠️ Network géolocalisation échouée:', error);
    }

    // Fallback to IP geolocation
    if (fallbackToIP) {
      try {
        const ipLocation = await this.getIPLocation();
        if (ipLocation) {
          console.log('✅ IP géolocalisation réussie (fallback)');
          this.addToHistory(ipLocation);
          this.currentLocation = ipLocation;
          return ipLocation;
        }
      } catch (error) {
        console.warn('⚠️ IP géolocalisation échouée:', error);
      }
    }

    // Fallback to last known good location
    const lastGoodLocation = this.getLastGoodLocation();
    if (lastGoodLocation) {
      console.log('✅ Dernière position connue utilisée');
      return lastGoodLocation;
    }

    throw new Error('Impossible de déterminer la position géographique');
  }

  private async getGPSLocation(options: PositionOptions): Promise<LocationEntry | null> {
    if (!navigator.geolocation) {
      throw new Error('Géolocalisation non supportée');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationEntry = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            source: 'gps',
            quality: this.calculateQualityScore(position.coords.accuracy, 'gps')
          };
          resolve(location);
        },
        (error) => reject(error),
        options
      );
    });
  }

  private async getNetworkLocation(): Promise<LocationEntry | null> {
    // For browsers that support network-based geolocation
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationEntry = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy || 1000,
            timestamp: Date.now(),
            source: 'network',
            quality: this.calculateQualityScore(position.coords.accuracy || 1000, 'network')
          };
          resolve(location);
        },
        (error) => reject(error),
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    });
  }

  private async getIPLocation(): Promise<LocationEntry | null> {
    for (const serviceUrl of this.ipFallbackServices) {
      try {
        console.log(`🌐 Tentative IP géolocalisation: ${serviceUrl}`);
        
        const response = await fetch(serviceUrl);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Handle different API response formats
        let lat: number, lng: number, city: string, country: string, timezone: string;
        
        if (serviceUrl.includes('ipapi.co')) {
          lat = data.latitude;
          lng = data.longitude;
          city = data.city;
          country = data.country_name;
          timezone = data.timezone;
        } else if (serviceUrl.includes('ip-api.com')) {
          lat = data.lat;
          lng = data.lon;
          city = data.city;
          country = data.country;
          timezone = data.timezone;
        } else if (serviceUrl.includes('ipinfo.io')) {
          const [latStr, lngStr] = data.loc.split(',');
          lat = parseFloat(latStr);
          lng = parseFloat(lngStr);
          city = data.city;
          country = data.country;
          timezone = data.timezone;
        }
        
        if (lat && lng) {
          const location: LocationEntry = {
            coordinates: [lng, lat],
            accuracy: 10000, // IP geolocation is less accurate
            timestamp: Date.now(),
            source: 'ip',
            quality: this.calculateQualityScore(10000, 'ip'),
            context: { city, country, timezone }
          };
          
          console.log(`✅ IP géolocalisation réussie: ${city}, ${country}`);
          return location;
        }
        
      } catch (error) {
        console.warn(`❌ Service IP ${serviceUrl} échoué:`, error);
        continue;
      }
    }
    
    return null;
  }

  private async enrichLocationContext(location: LocationEntry): Promise<void> {
    try {
      // Use reverse geocoding to get location context
      const [lng, lat] = location.coordinates;
      
      // This would typically use a reverse geocoding service
      // For now, we'll simulate context enrichment
      const context: GeolocationContext = {
        city: 'Ville détectée',
        country: 'Pays détecté',
        region: 'Région détectée',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        countryCode: 'FR'
      };
      
      location.context = context;
      
    } catch (error) {
      console.warn('⚠️ Impossible d\'enrichir le contexte géographique:', error);
    }
  }

  private calculateQualityScore(accuracy: number, source: LocationEntry['source']): number {
    let baseScore: number;
    
    switch (source) {
      case 'gps':
        baseScore = 90;
        break;
      case 'network':
        baseScore = 70;
        break;
      case 'ip':
        baseScore = 30;
        break;
      case 'manual':
        baseScore = 50;
        break;
      default:
        baseScore = 0;
    }
    
    // Adjust based on accuracy
    if (accuracy < 10) return Math.min(baseScore + 10, 100);
    if (accuracy < 50) return baseScore;
    if (accuracy < 100) return Math.max(baseScore - 10, 0);
    if (accuracy < 1000) return Math.max(baseScore - 20, 0);
    return Math.max(baseScore - 30, 0);
  }

  private isLocationValid(location: LocationEntry, requireHighQuality: boolean): boolean {
    const minQuality = requireHighQuality ? 70 : 30;
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    return location.quality >= minQuality && 
           (Date.now() - location.timestamp) < maxAge &&
           Math.abs(location.coordinates[0]) <= 180 &&
           Math.abs(location.coordinates[1]) <= 90;
  }

  private addToHistory(location: LocationEntry): void {
    this.locationHistory.unshift(location);
    
    if (this.locationHistory.length > this.maxHistorySize) {
      this.locationHistory = this.locationHistory.slice(0, this.maxHistorySize);
    }
    
    this.saveHistory();
  }

  private getLastGoodLocation(): LocationEntry | null {
    const validLocations = this.locationHistory.filter(loc => 
      this.isLocationValid(loc, false)
    );
    
    return validLocations.length > 0 ? validLocations[0] : null;
  }

  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.locationHistory = JSON.parse(stored);
        console.log(`📚 Historique géolocalisation chargé: ${this.locationHistory.length} entrées`);
      }
    } catch (error) {
      console.warn('⚠️ Impossible de charger l\'historique de géolocalisation:', error);
      this.locationHistory = [];
    }
  }

  private saveHistory(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.locationHistory));
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder l\'historique de géolocalisation:', error);
    }
  }

  getCurrentLocation(): LocationEntry | null {
    return this.currentLocation;
  }

  getLocationHistory(): LocationEntry[] {
    return [...this.locationHistory];
  }

  getLocationQualityStats(): {
    averageQuality: number;
    gpsSuccessRate: number;
    totalAttempts: number;
  } {
    if (this.locationHistory.length === 0) {
      return { averageQuality: 0, gpsSuccessRate: 0, totalAttempts: 0 };
    }
    
    const avgQuality = this.locationHistory.reduce((sum, loc) => sum + loc.quality, 0) / this.locationHistory.length;
    const gpsAttempts = this.locationHistory.filter(loc => loc.source === 'gps').length;
    const gpsSuccessRate = gpsAttempts / this.locationHistory.length;
    
    return {
      averageQuality: Math.round(avgQuality),
      gpsSuccessRate: Math.round(gpsSuccessRate * 100),
      totalAttempts: this.locationHistory.length
    };
  }

  clearHistory(): void {
    this.locationHistory = [];
    this.currentLocation = null;
    localStorage.removeItem(this.storageKey);
    console.log('🧹 Historique géolocalisation vidé');
  }
}

export const enhancedGeolocationService = EnhancedGeolocationService.getInstance();