
// Fonction de validation du token Mapbox avec gestion d'erreurs améliorée
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
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const isValid = response.status !== 401 && response.status !== 403;
    
    if (isValid) {
      console.log('✅ Token Mapbox validé avec succès');
      // Stocker le token validé dans le localStorage pour usage ultérieur
      localStorage.setItem('MAPBOX_VALIDATED_TOKEN', token);
      localStorage.setItem('MAPBOX_TOKEN_VALIDATION_TIME', Date.now().toString());
    } else {
      console.error('❌ Token Mapbox invalide - Statut:', response.status);
      localStorage.removeItem('MAPBOX_VALIDATED_TOKEN');
      localStorage.removeItem('MAPBOX_TOKEN_VALIDATION_TIME');
    }
    
    return isValid;
  } catch (error) {
    console.error('Erreur de validation du token Mapbox:', error);
    return false;
  }
};

// Vérifier si le token en cache est encore valide (valide pour 1 heure)
export const isCachedTokenValid = (): boolean => {
  const cachedToken = localStorage.getItem('MAPBOX_VALIDATED_TOKEN');
  const validationTime = localStorage.getItem('MAPBOX_TOKEN_VALIDATION_TIME');
  
  if (!cachedToken || !validationTime) {
    return false;
  }
  
  const oneHour = 60 * 60 * 1000; // 1 heure en millisecondes
  const isStillValid = (Date.now() - parseInt(validationTime)) < oneHour;
  
  return isStillValid;
};

// Obtenir le token validé du cache ou valider un nouveau token
export const getValidatedToken = async (): Promise<string | null> => {
  // Vérifier d'abord le cache
  if (isCachedTokenValid()) {
    return localStorage.getItem('MAPBOX_VALIDATED_TOKEN');
  }
  
  // Sinon, importer et valider le token depuis la config
  try {
    const { getMapboxToken } = await import('@/utils/mapboxConfig');
    const token = getMapboxToken();
    
    const isValid = await validateMapboxToken(token);
    return isValid ? token : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};
