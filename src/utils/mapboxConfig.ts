
/**
 * Configuration centralisée pour Mapbox
 */

// Variable for better error handling
let tokenWarningShown = false;

export const getMapboxToken = (): string => {
  // First try to get from env
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  
  // Updated Mapbox token provided by the user
  const hardcodedToken = "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A";
  
  const finalToken = token || hardcodedToken;
  
  if (!finalToken && !tokenWarningShown) {
    console.error("❌ Le token Mapbox est manquant. Vérifie ton fichier .env");
    tokenWarningShown = true; // Show warning only once
  }
  
  return finalToken;
};

export const isMapboxTokenValid = (): boolean => {
  const token = getMapboxToken();
  return !!token && token.length > 10; // Simple validation that token exists and has reasonable length
};

// Constants for default map configuration
export const DEFAULT_MAP_CENTER = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;
export const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

// Helper for responsive zoom levels
export const getResponsiveZoom = (isMobile: boolean, baseZoom: number = DEFAULT_MAP_ZOOM): number => {
  return isMobile ? Math.max(baseZoom - 2, 4) : baseZoom;
};

// Enhanced configuration for filters and search
export const MAPBOX_CONFIG = {
  // Geocoding API configuration
  geocoding: {
    endpoint: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    limit: 10,
    country: 'fr',
    language: 'fr',
    proximity: DEFAULT_MAP_CENTER
  },
  
  // Directions API configuration
  directions: {
    endpoint: 'https://api.mapbox.com/directions/v5/mapbox',
    profiles: {
      driving: 'driving',
      walking: 'walking',
      cycling: 'cycling'
    }
  },
  
  // Isochrone API configuration
  isochrone: {
    endpoint: 'https://api.mapbox.com/isochrone/v1/mapbox',
    maxDuration: 60, // minutes
    maxDistance: 50 // kilometers
  },
  
  // Places API configuration for categories
  places: {
    endpoint: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    categories: {
      restaurant: 'restaurant',
      cafe: 'cafe',
      shop: 'shop',
      hospital: 'hospital',
      pharmacy: 'pharmacy',
      school: 'school',
      bank: 'bank',
      gas_station: 'fuel',
      parking: 'parking'
    }
  }
};
