
// Configuration Mapbox optimisée avec validation et nouvelle clé API
export const getMapboxToken = (): string => {
  // Nouvelle clé API Mapbox mise à jour
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
                import.meta.env.MAPBOX_ACCESS_TOKEN ||
                'sk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWJiMWVqN28xNHJ3MmtwOTdzdXByMmYxIn0.YI7eowiGblU8h37_UDGI8g';

  if (!token) {
    console.error('⚠️ MAPBOX TOKEN MANQUANT! Veuillez configurer VITE_MAPBOX_ACCESS_TOKEN');
    throw new Error('Token Mapbox non configuré');
  }

  // Validation basique du format du token (accepter sk. et pk.)
  if (!token.startsWith('pk.') && !token.startsWith('sk.')) {
    console.warn('⚠️ Format de token Mapbox suspect:', token.substring(0, 10) + '...');
  }

  return token;
};

// Fonction de validation du token Mapbox
export const isMapboxTokenValid = (): boolean => {
  try {
    const token = getMapboxToken();
    return token && (token.startsWith('pk.') || token.startsWith('sk.')) && token.length > 50;
  } catch (error) {
    console.error('Token Mapbox invalide:', error);
    return false;
  }
};

// Configuration des styles de carte disponibles
export const MAPBOX_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1'
} as const;

// Configuration par défaut pour la France
export const FRANCE_BOUNDS = {
  bbox: [-5.559, 41.26, 9.662, 51.312] as [number, number, number, number],
  center: [2.3522, 48.8566] as [number, number], // Paris
  zoom: 6
};

// Valeurs par défaut pour la carte
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

// Configuration des limites de recherche
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 8,
  debounceMs: 300,
  timeoutMs: 10000,
  retryAttempts: 2
};
