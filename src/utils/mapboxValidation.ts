
import { getMapboxToken } from './mapboxConfig';

/**
 * Valide un token Mapbox via un appel API de test
 */
export async function validateMapboxToken(token: string): Promise<boolean> {
  try {
    // Test avec une requête de géocodage simple
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/paris.json?access_token=${token}&limit=1`;
    
    const response = await fetch(testUrl);
    
    if (response.ok) {
      console.log('✅ Token Mapbox validé avec succès');
      return true;
    }
    
    if (response.status === 401) {
      console.error('❌ Token Mapbox non autorisé (401)');
      return false;
    }
    
    const errorData = await response.text();
    console.error(`❌ Erreur validation token (${response.status}):`, errorData);
    return false;
    
  } catch (error) {
    console.error('❌ Erreur réseau lors de la validation:', error);
    return false;
  }
}

/**
 * Vérifie et valide le token configuré
 */
export async function checkMapboxToken(): Promise<boolean> {
  try {
    const token = getMapboxToken();
    return await validateMapboxToken(token);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token:', error);
    return false;
  }
}

/**
 * Test de connectivité API Mapbox
 */
export async function testMapboxConnectivity(): Promise<{
  success: boolean;
  latency?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const token = getMapboxToken();
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`
    );
    
    const latency = Date.now() - startTime;
    
    return {
      success: response.ok,
      latency,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}
