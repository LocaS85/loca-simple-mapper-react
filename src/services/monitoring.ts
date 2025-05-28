
import * as Sentry from '@sentry/react';

// Configuration Sentry
export const initMonitoring = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN, // À définir dans les variables d'environnement
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filtrer les erreurs en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('Sentry Event:', event);
      }
      return event;
    }
  });
};

// Fonctions utilitaires pour le monitoring
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope(scope => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setTag(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: { id: string; email?: string }) => {
  Sentry.setUser(user);
};

// Wrapper pour les erreurs Mapbox
export const captureMapboxError = (error: Error, context: {
  apiCall: string;
  params?: any;
  userLocation?: [number, number];
}) => {
  captureError(error, {
    service: 'mapbox',
    api_call: context.apiCall,
    user_location: context.userLocation?.join(','),
    ...context.params
  });
};
