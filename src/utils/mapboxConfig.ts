
/**
 * Configuration centralisée pour Mapbox
 */

// Variable for better error handling
let tokenWarningShown = false;

export const getMapboxToken = (): string => {
  // First try to get from env
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  
  // If not in env, use this hardcoded token which has been provided by the user
  // IMPORTANT: In production, use environment variables instead of hardcoded tokens
  const hardcodedToken = "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg";
  
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
