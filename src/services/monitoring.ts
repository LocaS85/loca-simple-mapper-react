
// Service de monitoring simple sans dépendances externes
export const initMonitoring = () => {
  console.log('Monitoring initialized (development mode)');
  
  // Capture des erreurs globales
  window.addEventListener('error', (event) => {
    console.error('Global error captured:', event.error);
  });
  
  // Capture des promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
};

// Fonctions utilitaires pour le monitoring
export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('Error captured:', {
    message: error.message,
    stack: error.stack,
    context
  });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  console[level]('Message captured:', message);
};

export const setUserContext = (user: { id: string; email?: string }) => {
  console.log('User context set:', user);
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
