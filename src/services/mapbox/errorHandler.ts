
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
  }

  handleError(error: any, context: MapboxErrorContext): MapboxError {
    const enhancedError = this.createEnhancedError(error, context);
    
    // Capturer l'erreur pour le monitoring
    captureMapboxError(enhancedError, context);
    
    console.error(`❌ Erreur Mapbox [${context.operation}]:`, enhancedError);
    
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
    } else if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      message = 'Problème de connexion réseau';
      code = 'NETWORK_ERROR';
      statusCode = 0;
      this.setOfflineMode(true);
    } else if (error?.message) {
      message = error.message;
      code = 'API_ERROR';
    }

    return new MapboxError(message, code, statusCode, context);
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

        // Ne pas retry si c'est une erreur de token
        if (lastError.code === 'INVALID_TOKEN' || lastError.code === 'ACCESS_DENIED') {
          break;
        }

        // Attendre avant le prochain essai (backoff exponentiel)
        const delay = baseDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fallback pour mode hors-ligne
  getOfflineFallback(operation: string): any {
    switch (operation) {
      case 'geocoding':
        return this.getOfflineGeocodingFallback();
      case 'directions':
        return this.getOfflineDirectionsFallback();
      default:
        return null;
    }
  }

  private getOfflineGeocodingFallback() {
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
}

export const mapboxErrorHandler = MapboxErrorHandler.getInstance();
