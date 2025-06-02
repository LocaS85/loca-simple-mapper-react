
// Constants for default map values
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

// Default radius in kilometers
export const DEFAULT_SEARCH_RADIUS = 10;

// Extend Window interface for Mapbox token
declare global {
  interface Window {
    __MAPBOX_TOKEN__?: string;
  }
}

/**
 * Get the Mapbox token from environment, with fallback
 */
export function getMapboxToken(): string {
  // Check for runtime token
  const token = window.__MAPBOX_TOKEN__ || 
                import.meta.env.VITE_MAPBOX_TOKEN || 
                process.env.MAPBOX_TOKEN || 
                localStorage.getItem('mapbox_token');

  if (!token) {
    throw new Error('Token Mapbox non configuré. Utilisez VITE_MAPBOX_TOKEN dans .env ou window.__MAPBOX_TOKEN__');
  }

  return token;
}

/**
 * Checks if token is a valid Mapbox token format (starts with 'pk.')
 */
export function isMapboxTokenValid(): boolean {
  try {
    const token = getMapboxToken();
    // Les tokens publics commencent par 'pk.'
    const isPublic = token.startsWith('pk.');
    // Vérification basique de longueur
    const hasValidLength = token.length > 50;
    
    return isPublic && hasValidLength;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token Mapbox:', error);
    return false;
  }
}

/**
 * Save token to localStorage
 */
export function saveMapboxToken(token: string): void {
  localStorage.setItem('mapbox_token', token);
  // Add global for runtime access
  window.__MAPBOX_TOKEN__ = token;
}

/**
 * Calculate bounding box around a point (in km)
 */
export function calculateBoundingBox(center: [number, number], radiusKm: number): [number, number, number, number] {
  // Approximation: 1 degree ≈ 111.32 km at the equator
  const radiusInDegrees = radiusKm / 111.32; 
  
  return [
    center[0] - radiusInDegrees,  // west
    center[1] - radiusInDegrees,  // south
    center[0] + radiusInDegrees,  // east
    center[1] + radiusInDegrees   // north
  ];
}
