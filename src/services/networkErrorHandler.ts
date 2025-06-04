
/**
 * Gestionnaire d'erreurs réseau avec retry automatique
 */
class NetworkErrorHandler {
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 1000;

  /**
   * Gère un appel API avec retry automatique
   */
  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    onRetry?: (attempt: number) => void
  ): Promise<T> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await apiCall();
        this.retryCount = 0; // Reset sur succès
        return result;
      } catch (error) {
        console.error(`❌ Tentative ${attempt}/${this.maxRetries} échouée:`, error);
        
        if (attempt === this.maxRetries) {
          throw this.createEnhancedError(error);
        }
        
        // Retry avec backoff exponentiel
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Nouvelle tentative dans ${delay}ms...`);
        
        onRetry?.(attempt);
        await this.sleep(delay);
      }
    }
    
    throw new Error('Nombre maximum de tentatives atteint');
  }

  /**
   * Crée une erreur enrichie avec contexte
   */
  private createEnhancedError(originalError: any): Error {
    let message = 'Erreur de réseau';
    
    if (originalError?.message) {
      message = originalError.message;
    }
    
    if (originalError?.status === 401) {
      message = 'Token Mapbox invalide ou expiré';
    } else if (originalError?.status === 429) {
      message = 'Limite de taux API dépassée';
    } else if (originalError?.status >= 500) {
      message = 'Erreur serveur Mapbox';
    }
    
    const enhancedError = new Error(message);
    enhancedError.cause = originalError;
    return enhancedError;
  }

  /**
   * Utilitaire de délai
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Réinitialise le compteur de retry
   */
  reset(): void {
    this.retryCount = 0;
  }

  /**
   * Configure les paramètres de retry
   */
  configure(maxRetries: number, baseDelay: number): void {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }
}

export const networkErrorHandler = new NetworkErrorHandler();
