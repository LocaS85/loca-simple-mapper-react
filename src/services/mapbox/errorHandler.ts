
import { captureMapboxError } from '../monitoring';

export interface MapboxErrorContext {
  operation: string;
  userLocation?: [number, number] | null;
  params?: any;
  retryCount?: number;
}

export class MapboxError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: MapboxErrorContext
  ) {
    super(message);
    this.name = 'MapboxError';
  }
}

export class MapboxErrorHandler {
  private static instance: MapboxErrorHandler;
  private offlineMode = false;
  private lastKnownLocation: [number, number] | null = null;
  private fallbackData: Map<string, any> = new Map();

  static getInstance(): MapboxErrorHandler {
    if (!MapboxErrorHandler.instance) {
      MapboxErrorHandler.instance = new MapboxErrorHandler();
    }
    return MapboxErrorHandler.instance;
  }

  setOfflineMode(offline: boolean): void {
    this.offlineMode = offline;
    console.log(`📱 Mode hors-ligne ${offline ? 'activé' : 'désactivé'}`);
  }

  setLastKnownLocation(location: [number, number]): void {
    this.lastKnownLocation = location;
    // Stocker la localisation dans le cache de fallback
    this.fallbackData.set('lastLocation', location);
  }

  handleError(error: any, context: MapboxErrorContext): MapboxError {
    const enhancedError = this.createEnhancedError(error, context);
    
    // Adapter le contexte pour la fonction de monitoring
    const monitoringContext = {
      apiCall: context.operation,
      params: context.params,
      userLocation: context.userLocation
    };
    
    // Capturer l'erreur pour le monitoring
    captureMapboxError(enhancedError, monitoringContext);
    
    console.error(`❌ Erreur Mapbox [${context.operation}]:`, enhancedError);
    
    // Activer le mode hors-ligne si nécessaire
    if (this.isNetworkError(error)) {
      this.setOfflineMode(true);
    }
    
    return enhancedError;
  }

  private createEnhancedError(error: any, context: MapboxErrorContext): MapboxError {
    let message = 'Erreur de service Mapbox';
    let code = 'UNKNOWN_ERROR';
    let statusCode = 500;

    if (error?.response?.status) {
      statusCode = error.response.status;
      switch (statusCode) {
        case 401:
          message = 'Token Mapbox invalide ou expiré';
          code = 'INVALID_TOKEN';
          break;
        case 403:
          message = 'Accès refusé aux services Mapbox';
          code = 'ACCESS_DENIED';
          break;
        case 429:
          message = 'Limite de requêtes Mapbox atteinte';
          code = 'RATE_LIMIT';
          break;
        case 404:
          message = `Service Mapbox non trouvé pour ${context.operation}`;
          code = 'SERVICE_NOT_FOUND';
          break;
        case 422:
          message = 'Paramètres de requête invalides';
          code = 'INVALID_PARAMS';
          break;
        default:
          message = `Erreur serveur Mapbox (${statusCode})`;
          code = 'SERVER_ERROR';
      }
    } else if (this.isNetworkError(error)) {
      message = 'Problème de connexion réseau';
      code = 'NETWORK_ERROR';
      statusCode = 0;
    } else if (error?.message) {
      message = error.message;
      code = 'API_ERROR';
    }

    return new MapboxError(message, code, statusCode, context);
  }

  private isNetworkError(error: any): boolean {
    return error?.message?.includes('fetch') || 
           error?.message?.includes('network') ||
           error?.message?.includes('timeout') ||
           error?.name === 'AbortError';
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    context: MapboxErrorContext,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: MapboxError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`🔄 Tentative ${attempt + 1}/${maxRetries + 1} pour ${context.operation}`);
        }
        
        return await operation();
      } catch (error) {
        lastError = this.handleError(error, { ...context, retryCount: attempt });
        
        if (attempt === maxRetries) {
          break;
        }

        // Ne pas retry si c'est une erreur de token ou d'autorisation
        if (lastError.code === 'INVALID_TOKEN' || lastError.code === 'ACCESS_DENIED') {
          break;
        }

        // Attendre avant le prochain essai (backoff exponentiel avec jitter)
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fallbacks améliorés pour mode hors-ligne
  getOfflineFallback(operation: string, params?: any): any {
    switch (operation) {
      case 'geocoding':
        return this.getOfflineGeocodingFallback(params);
      case 'directions':
        return this.getOfflineDirectionsFallback();
      case 'search':
        return this.getOfflineSearchFallback(params);
      default:
        return null;
    }
  }

  private getOfflineGeocodingFallback(params?: any) {
    const cached = this.fallbackData.get('geocoding_' + JSON.stringify(params));
    if (cached) return cached;

    if (this.lastKnownLocation) {
      return [{
        id: 'offline-location',
        name: 'Position mémorisée',
        address: 'Dernière position connue',
        coordinates: this.lastKnownLocation,
        category: 'saved_location',
        distance: 0
      }];
    }
    return [];
  }

  private getOfflineDirectionsFallback() {
    return {
      geometry: { type: 'LineString', coordinates: [] },
      distance: 0,
      duration: 0,
      steps: []
    };
  }

  private getOfflineSearchFallback(params?: any) {
    const cached = this.fallbackData.get('search_' + JSON.stringify(params));
    if (cached) return cached;

    // Retourner des résultats génériques basés sur la dernière position connue
    if (this.lastKnownLocation) {
      return [
        {
          id: 'offline-poi-1',
          name: 'Point d\'intérêt local',
          address: 'Près de votre position',
          coordinates: this.lastKnownLocation,
          category: 'general',
          distance: 0.1
        }
      ];
    }
    return [];
  }

  // Méthode pour stocker des données de fallback
  cacheFallbackData(key: string, data: any): void {
    this.fallbackData.set(key, data);
    
    // Limiter la taille du cache
    if (this.fallbackData.size > 50) {
      const firstKey = this.fallbackData.keys().next().value;
      this.fallbackData.delete(firstKey);
    }
  }

  // Nettoyer le cache
  clearFallbackCache(): void {
    this.fallbackData.clear();
  }
}

export const mapboxErrorHandler = MapboxErrorHandler.getInstance();
