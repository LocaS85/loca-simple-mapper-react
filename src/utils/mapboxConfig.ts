
// Configuration centralisée pour Mapbox avec validation avancée
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;
export const DEFAULT_SEARCH_RADIUS = 10;

// Interface globale pour le token Mapbox
declare global {
  interface Window {
    __MAPBOX_TOKEN__?: string;
  }
}

/**
 * Obtenir le token Mapbox avec priorité env > window > localStorage
 */
export function getMapboxToken(): string {
  // Ordre de priorité: variable d'environnement, window global, localStorage
  const token = import.meta.env.VITE_MAPBOX_TOKEN || 
                window.__MAPBOX_TOKEN__ || 
                localStorage.getItem('mapbox_token');

  if (!token) {
    console.warn('⚠️ Token Mapbox non configuré. Veuillez configurer VITE_MAPBOX_TOKEN dans .env');
    throw new Error('Token Mapbox requis. Configurez VITE_MAPBOX_TOKEN ou utilisez l\'interface de configuration.');
  }

  return token;
}

/**
 * Validation complète du token Mapbox
 */
export function isMapboxTokenValid(): boolean {
  try {
    const token = getMapboxToken();
    // Vérification format token public
    const isPublic = token.startsWith('pk.');
    // Vérification longueur minimale
    const hasValidLength = token.length > 50;
    
    console.log('🔍 Validation token Mapbox:', { 
      isPublic, 
      hasValidLength, 
      tokenPrefix: token.substring(0, 15) + '...' 
    });
    
    return isPublic && hasValidLength;
  } catch (error) {
    console.error('❌ Erreur validation token Mapbox:', error);
    return false;
  }
}

/**
 * Sauvegarder le token dans le localStorage et window
 */
export function saveMapboxToken(token: string): void {
  localStorage.setItem('mapbox_token', token);
  window.__MAPBOX_TOKEN__ = token;
  console.log('💾 Token Mapbox sauvegardé');
}

/**
 * Calculer une bounding box autour d'un point
 */
export function calculateBoundingBox(
  center: [number, number], 
  radiusKm: number
): [number, number, number, number] {
  // 1 degré ≈ 111.32 km à l'équateur
  const radiusInDegrees = radiusKm / 111.32; 
  
  return [
    center[0] - radiusInDegrees,  // ouest
    center[1] - radiusInDegrees,  // sud
    center[0] + radiusInDegrees,  // est
    center[1] + radiusInDegrees   // nord
  ];
}

/**
 * Convertir les unités de distance
 */
export function convertDistance(distance: number, from: 'km' | 'mi', to: 'km' | 'mi'): number {
  if (from === to) return distance;
  return from === 'km' ? distance * 0.621371 : distance * 1.60934;
}

/**
 * Calculer la distance entre deux points (Haversine)
 */
export function calculateDistance(
  point1: [number, number], 
  point2: [number, number], 
  unit: 'km' | 'mi' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959;
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
