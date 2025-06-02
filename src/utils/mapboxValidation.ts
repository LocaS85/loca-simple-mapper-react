
import { getMapboxToken } from './mapboxConfig';

/**
 * Validates a Mapbox token by making a test API call
 */
export async function validateMapboxToken(token: string): Promise<boolean> {
  try {
    // Make a simple request to validate the token
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/paris.json?access_token=${token}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      console.log('✅ Token validé avec succès');
      return true;
    }
    
    if (response.status === 401) {
      console.error('❌ Token non autorisé (401)');
      return false;
    }
    
    const errorText = await response.text();
    console.error(`❌ Erreur de validation (${response.status}):`, errorText);
    return false;
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation du token:', error);
    return false;
  }
}

/**
 * Checks if a token is available and valid
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
