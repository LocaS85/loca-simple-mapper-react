
// Configuration Mapbox optimisée avec token public pour le frontend
export const getMapboxToken = (): string => {
  // IMPORTANT: Utiliser un token PUBLIC (pk.) pour le frontend, pas secret (sk.)
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
                import.meta.env.MAPBOX_ACCESS_TOKEN ||
                'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A'; // Token public valide

  if (!token) {
    console.error('⚠️ MAPBOX TOKEN MANQUANT! Veuillez configurer VITE_MAPBOX_ACCESS_TOKEN');
    throw new Error('Token Mapbox non configuré');
  }

  // Validation pour s'assurer qu'on utilise un token public
  if (!token.startsWith('pk.')) {
    console.error('❌ ERREUR: Token secret détecté! Utiliser un token PUBLIC (pk.) pour le frontend');
    throw new Error('Token Mapbox incorrect - utilisez un token public (pk.) pour le frontend');
  }

  return token;
};

// Fonction de validation du token Mapbox
export const isMapboxTokenValid = (): boolean => {
  try {
    const token = getMapboxToken();
    return token && token.startsWith('pk.') && token.length > 50;
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

// Configuration optimisée pour éviter les erreurs de build
export const MAPBOX_CONFIG = {
  // Worker settings pour éviter les erreurs CSP
  workerClass: null,
  workerCount: 0
};
