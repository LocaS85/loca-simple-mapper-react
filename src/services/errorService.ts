
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorService {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  logError(error: Error, context: ErrorContext = {}, severity: ErrorReport['severity'] = 'medium') {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        timestamp: Date.now(),
        userAgent: navigator?.userAgent,
        url: window?.location?.href
      },
      severity
    };

    this.errors.push(errorReport);
    
    // Garder seulement les dernières erreurs
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // En développement, afficher dans la console
    if (import.meta.env.DEV) {
      console.error('🔥 Erreur capturée:', errorReport);
    }

    // En production, envoyer au service de monitoring
    if (import.meta.env.PROD && severity === 'critical') {
      this.sendToCrashReporting(errorReport);
    }
  }

  private sendToCrashReporting(errorReport: ErrorReport) {
    // Implémentation du service de crash reporting
    console.error('Erreur critique envoyée au monitoring:', errorReport);
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorService = new ErrorService();
