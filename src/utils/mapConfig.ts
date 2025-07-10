/**
 * Configuration centrale pour Mapbox et la carte
 */

// Styles de carte disponibles
export const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1'
} as const;

export type MapStyle = keyof typeof MAP_STYLES;

// Configuration par défaut de la carte
export const DEFAULT_MAP_CONFIG = {
  style: MAP_STYLES.light,
  center: [2.3522, 48.8566] as [number, number], // Paris
  zoom: 11,
  pitch: 0,
  bearing: 0,
  attributionControl: false,
  logoPosition: 'bottom-right' as const,
  maxZoom: 18,
  minZoom: 3
};

// Configuration des contrôles de navigation
export const NAVIGATION_CONTROL_CONFIG = {
  showCompass: true,
  showZoom: true,
  visualizePitch: false
};

// Configuration du contrôle de géolocalisation
export const GEOLOCATE_CONTROL_CONFIG = {
  positionOptions: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  },
  trackUserLocation: false,
  showUserHeading: false,
  showAccuracyCircle: true
};

// Couleurs des modes de transport (Google Maps style)
export const TRANSPORT_COLORS = {
  car: '#0074D9',
  walking: '#2ECC40',
  cycling: '#FF851B',
  bus: '#B10DC9',
  train: '#FF4136'
} as const;

export type TransportMode = keyof typeof TRANSPORT_COLORS;

// Configuration des couches de routes
export const ROUTE_LAYER_CONFIG = {
  lineJoin: 'round' as const,
  lineCap: 'round' as const,
  defaultWidth: {
    min: 3,
    max: 8
  },
  primaryRouteWidth: {
    min: 4,
    max: 10
  },
  borderWidth: {
    min: 6,
    max: 12
  },
  opacity: {
    primary: 0.9,
    secondary: 0.7,
    tertiary: 0.5
  }
};

// Configuration des marqueurs
export const MARKER_CONFIG = {
  user: {
    color: '#4285f4',
    size: {
      min: 8,
      max: 15
    },
    strokeWidth: 3,
    strokeColor: '#ffffff',
    pulseSize: {
      min: 15,
      max: 30
    }
  },
  result: {
    color: '#ea4335',
    size: {
      min: 15,
      max: 22
    },
    strokeWidth: 3,
    strokeColor: '#ffffff',
    labelColor: '#ffffff',
    labelSize: {
      min: 10,
      max: 14
    }
  }
};

// Configuration des animations
export const ANIMATION_CONFIG = {
  flyTo: {
    duration: 1000,
    curve: 1.42,
    easing: (t: number) => t * (2 - t) // ease-out
  },
  fitBounds: {
    duration: 1000,
    padding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 300 // Espace pour sidebar
    },
    maxZoom: 15
  }
};

// Configuration responsive
export const RESPONSIVE_CONFIG = {
  mobile: {
    fitBoundsPadding: {
      top: 100,
      bottom: 100,
      left: 20,
      right: 20
    },
    maxZoom: 16
  },
  desktop: {
    fitBoundsPadding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 350
    },
    maxZoom: 15
  }
};

// Configuration des popups
export const POPUP_CONFIG = {
  closeButton: false,
  closeOnClick: false,
  offset: 25,
  maxWidth: '300px',
  className: 'custom-popup'
};

// Limites de performance
export const PERFORMANCE_LIMITS = {
  maxResults: 50,
  maxRoutes: 5,
  maxMarkersOnScreen: 100,
  routeSimplificationTolerance: 0.0001
};

// Configuration des clustes (pour grand nombre de marqueurs)
export const CLUSTER_CONFIG = {
  radius: 50,
  maxZoom: 14,
  minPoints: 2,
  colors: [
    '#51bbd6',
    '#f1c40f', 
    '#e74c3c',
    '#9b59b6'
  ]
};

// Fonctions utilitaires de configuration

/**
 * Obtient la configuration responsive selon la taille d'écran
 */
export const getResponsiveConfig = (isMobile: boolean) => {
  return isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
};

/**
 * Obtient la couleur du transport
 */
export const getTransportColor = (transport: string): string => {
  return TRANSPORT_COLORS[transport as TransportMode] || TRANSPORT_COLORS.walking;
};

/**
 * Configuration de base pour une nouvelle instance de carte
 */
export const getBaseMapConfig = (userLocation?: [number, number] | null) => {
  return {
    ...DEFAULT_MAP_CONFIG,
    center: userLocation || DEFAULT_MAP_CONFIG.center,
    zoom: userLocation ? 13 : DEFAULT_MAP_CONFIG.zoom
  };
};

/**
 * Configuration pour l'export de carte (PDF, image)
 */
export const getExportMapConfig = () => {
  return {
    preserveDrawingBuffer: true,
    antialias: true,
    failIfMajorPerformanceCaveat: false
  };
};

/**
 * Valide une configuration de carte personnalisée
 */
export const validateMapConfig = (config: any): boolean => {
  try {
    return !!(
      config.center &&
      Array.isArray(config.center) &&
      config.center.length === 2 &&
      typeof config.zoom === 'number' &&
      config.zoom >= 0 &&
      config.zoom <= 24
    );
  } catch {
    return false;
  }
};