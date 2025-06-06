
import { getMapboxToken } from './mapboxConfig';

/**
 * Valide un token Mapbox via un appel API de test avec retry
 */
export async function validateMapboxToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string' || !token.trim()) {
    console.error('❌ Token Mapbox vide ou invalide');
    return false;
  }

  // Vérification du format du token
  if (!token.startsWith('pk.')) {
    console.error('❌ Token Mapbox doit commencer par "pk." (token public)');
    return false;
  }

  try {
    // Test avec une requête de géocodage simple
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/paris.json?access_token=${token}&limit=1`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(testUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'LocaSimple/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.features) {
        console.log('✅ Token Mapbox validé avec succès');
        return true;
      }
    }
    
    if (response.status === 401) {
      console.error('❌ Token Mapbox non autorisé (401) - Vérifiez votre token');
      return false;
    }
    
    if (response.status === 403) {
      console.error('❌ Token Mapbox interdit (403) - Vérifiez les permissions');
      return false;
    }
    
    const errorData = await response.text();
    console.error(`❌ Erreur validation token (${response.status}):`, errorData);
    return false;
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Timeout lors de la validation du token Mapbox');
      return false;
    }
    
    console.error('❌ Erreur réseau lors de la validation du token:', error);
    return false;
  }
}

/**
 * Vérifie et valide le token configuré avec cache
 */
let tokenValidationCache: { token: string; isValid: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkMapboxToken(): Promise<boolean> {
  try {
    const token = getMapboxToken();
    
    // Vérifier le cache
    if (tokenValidationCache && 
        tokenValidationCache.token === token && 
        Date.now() - tokenValidationCache.timestamp < CACHE_DURATION) {
      return tokenValidationCache.isValid;
    }
    
    const isValid = await validateMapboxToken(token);
    
    // Mettre à jour le cache
    tokenValidationCache = {
      token,
      isValid,
      timestamp: Date.now()
    };
    
    return isValid;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token:', error);
    return false;
  }
}

/**
 * Test de connectivité API Mapbox avec mesure de performance
 */
export async function testMapboxConnectivity(): Promise<{
  success: boolean;
  latency?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const token = getMapboxToken();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LocaSimple/1.0'
        }
      }
    );
    
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`✅ Connectivité Mapbox OK (${latency}ms)`);
      return { success: true, latency };
    }
    
    return {
      success: false,
      latency,
      error: `HTTP ${response.status}: ${response.statusText}`
    };
    
  } catch (error) {
    const latency = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        latency,
        error: 'Timeout de connexion'
      };
    }
    
    return {
      success: false,
      latency,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Clear validation cache
 */
export function clearValidationCache(): void {
  tokenValidationCache = null;
}
