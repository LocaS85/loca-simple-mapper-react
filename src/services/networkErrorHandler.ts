
export class NetworkErrorHandler {
  private retryAttempts = 0;
  private maxRetries = 3;
  private baseDelay = 1000;

  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    onRetry?: (attempt: number) => void
  ): Promise<T> {
    try {
      const result = await apiCall();
      this.retryAttempts = 0; // Reset on success
      return result;
    } catch (error) {
      if (this.retryAttempts < this.maxRetries && this.isRetryableError(error)) {
        this.retryAttempts++;
        const delay = this.baseDelay * Math.pow(2, this.retryAttempts - 1);
        
        console.log(`🔄 Tentative ${this.retryAttempts}/${this.maxRetries} dans ${delay}ms`);
        
        if (onRetry) {
          onRetry(this.retryAttempts);
        }
        
        await this.delay(delay);
        return this.handleApiCall(apiCall, onRetry);
      }
      
      throw this.enhanceError(error);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('fetch') ||
        message.includes('connection')
      );
    }
    return false;
  }

  private enhanceError(error: unknown): Error {
    if (error instanceof Error) {
      const enhancedMessage = this.getEnhancedErrorMessage(error);
      const enhancedError = new Error(enhancedMessage);
      enhancedError.name = error.name;
      enhancedError.stack = error.stack;
      return enhancedError;
    }
    return new Error('Erreur réseau inconnue');
  }

  private getEnhancedErrorMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Problème de connexion réseau. Vérifiez votre connexion internet.';
    }
    
    if (message.includes('timeout')) {
      return 'Délai d\'attente dépassé. Le serveur met trop de temps à répondre.';
    }
    
    if (message.includes('401')) {
      return 'Token d\'authentification invalide ou expiré.';
    }
    
    if (message.includes('429')) {
      return 'Trop de requêtes. Veuillez patienter avant de réessayer.';
    }
    
    if (message.includes('500')) {
      return 'Erreur du serveur. Veuillez réessayer plus tard.';
    }
    
    return error.message;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(): void {
    this.retryAttempts = 0;
  }
}

export const networkErrorHandler = new NetworkErrorHandler();
