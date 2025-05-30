
// Fonction de validation du token Mapbox
export const validateMapboxToken = async (token: string): Promise<boolean> => {
  try {
    // Utiliser une URL d'API différente selon le type de token
    let testUrl: string;
    if (token.startsWith('sk.')) {
      // Pour les tokens secrets, utiliser l'API Tokens
      testUrl = `https://api.mapbox.com/tokens/v2?access_token=${token}`;
    } else {
      // Pour les tokens publics, utiliser l'API Geocoding
      testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`;
    }
    
    const response = await fetch(testUrl);
    const isValid = response.status !== 401 && response.status !== 403;
    
    if (isValid) {
      console.log('✅ Token Mapbox validé avec succès');
    } else {
      console.error('❌ Token Mapbox invalide - Statut:', response.status);
    }
    
    return isValid;
  } catch (error) {
    console.error('Erreur de validation du token Mapbox:', error);
    return false;
  }
};
