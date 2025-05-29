
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
}

class ErrorService {
  private errors: Array<{ error: Error; context: ErrorContext }> = [];
  private maxErrors = 50;

  // Capturer et logger les erreurs
  captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    const fullContext: ErrorContext = {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };

    this.errors.unshift({ error, context: fullContext });
    
    // Limiter le nombre d'erreurs stockées
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Logger en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur capturée:', error, fullContext);
    }

    // Envoyer en production (si service de monitoring configuré)
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error, fullContext);
    }
  }

  // Récupérer les erreurs récentes
  getRecentErrors(limit: number = 10): Array<{ error: Error; context: ErrorContext }> {
    return this.errors.slice(0, limit);
  }

  // Vider les erreurs
  clearErrors(): void {
    this.errors = [];
  }

  // Envoyer au service de monitoring (placeholder)
  private async sendToMonitoring(error: Error, context: ErrorContext): Promise<void> {
    try {
      // Ici on pourrait envoyer à Sentry, LogRocket, etc.
      console.log('Envoi au monitoring:', { error: error.message, context });
    } catch (monitoringError) {
      console.warn('Erreur lors de l\'envoi au monitoring:', monitoringError);
    }
  }

  // Wrapper pour les fonctions async avec gestion d'erreurs
  async safeAsync<T>(
    fn: () => Promise<T>,
    fallback: T,
    context?: Partial<ErrorContext>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.captureError(error as Error, context);
      return fallback;
    }
  }

  // Wrapper pour les fonctions sync avec gestion d'erreurs
  safe<T>(
    fn: () => T,
    fallback: T,
    context?: Partial<ErrorContext>
  ): T {
    try {
      return fn();
    } catch (error) {
      this.captureError(error as Error, context);
      return fallback;
    }
  }
}

export const errorService = new ErrorService();

// Global error handler
window.addEventListener('error', (event) => {
  errorService.captureError(event.error, {
    component: 'Global',
    action: 'unhandled-error'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorService.captureError(new Error(event.reason), {
    component: 'Global',
    action: 'unhandled-promise-rejection'
  });
});
