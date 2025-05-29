
import { captureMapboxError } from './monitoring';

export interface ApiErrorContext {
  apiCall: string;
  params?: any;
  userLocation?: [number, number] | null;
  retryCount?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public context?: ApiErrorContext
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiErrorHandler = {
  // Gérer les erreurs Mapbox spécifiques
  handleMapboxError: (error: any, context: ApiErrorContext): ApiError => {
    console.error(`Mapbox API Error in ${context.apiCall}:`, error);
    
    // Capturer l'erreur pour le monitoring
    if (error instanceof Error) {
      captureMapboxError(error, context);
    }

    let message = 'Erreur de connexion à l\'API Mapbox';
    let statusCode = 500;

    if (error?.response?.status) {
      statusCode = error.response.status;
      switch (statusCode) {
        case 401:
          message = 'Token Mapbox invalide ou expiré';
          break;
        case 403:
          message = 'Accès refusé à l\'API Mapbox';
          break;
        case 429:
          message = 'Limite de requêtes Mapbox atteinte';
          break;
        case 404:
          message = 'Endpoint Mapbox non trouvé';
          break;
        default:
          message = `Erreur API Mapbox: ${statusCode}`;
      }
    } else if (error?.message?.includes('fetch')) {
      message = 'Problème de connexion réseau';
      statusCode = 0;
    }

    return new ApiError(message, statusCode, context);
  },

  // Retry logic avec backoff exponentiel
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Attendre avant le prochain essai (backoff exponentiel)
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Tentative ${attempt + 2}/${maxRetries + 1} dans ${delay}ms...`);
      }
    }

    throw lastError!;
  },

  // Vérifier si une erreur est récupérable
  isRetriableError: (error: any): boolean => {
    if (error?.response?.status) {
      const status = error.response.status;
      // Retry pour les erreurs serveur et rate limiting
      return status >= 500 || status === 429;
    }
    
    // Retry pour les erreurs réseau
    return error?.message?.includes('fetch') || error?.message?.includes('network');
  }
};
