
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

// Fonction sécurisée pour récupérer le token depuis Supabase Edge Function
export const getMapboxToken = async (): Promise<string> => {
  try {
    // Essayer de récupérer le token depuis le secret Supabase via Edge Function
    const response = await fetch('/api/mapbox-config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    
    // Fallback vers localStorage si l'API n'est pas disponible
    const localToken = localStorage.getItem('MAPBOX_ACCESS_TOKEN');
    if (localToken && localToken.startsWith('pk.')) {
      return localToken;
    }
    
    throw new Error('No valid Mapbox token found');
  } catch (error) {
    console.error('Failed to get Mapbox token:', error);
    throw error;
  }
};

// Version synchrone pour compatibilité avec l'ancien code
export const getMapboxTokenSync = (): string | null => {
  const localToken = localStorage.getItem('MAPBOX_ACCESS_TOKEN');
  return localToken && localToken.startsWith('pk.') ? localToken : null;
};

export const saveMapboxToken = (token: string): void => {
  if (!token || !token.startsWith('pk.')) {
    throw new Error('Invalid Mapbox token format');
  }
  localStorage.setItem('MAPBOX_ACCESS_TOKEN', token);
  console.log('Token Mapbox sauvegardé de manière sécurisée');
};

export const isMapboxTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getMapboxToken();
    return !!(token && token.startsWith('pk.'));
  } catch {
    return false;
  }
};

export const isMapboxTokenValidSync = (): boolean => {
  const token = getMapboxTokenSync();
  return !!(token && token.startsWith('pk.'));
};
