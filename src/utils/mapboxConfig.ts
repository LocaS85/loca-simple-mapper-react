
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

// Fonction sécurisée pour récupérer le token depuis Supabase Edge Function
export const getMapboxToken = async (): Promise<string> => {
  try {
    // 1. Vérifier window.__MAPBOX_TOKEN__ en premier
    if (typeof window !== 'undefined' && (window as any).__MAPBOX_TOKEN__) {
      const windowToken = (window as any).__MAPBOX_TOKEN__;
      if (windowToken && windowToken.startsWith('pk.')) {
        return windowToken;
      }
    }
    
    // 2. Essayer de récupérer le token depuis le secret Supabase via Edge Function
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase.functions.invoke('mapbox-config');
    
    if (!error && data?.token && data.token.startsWith('pk.')) {
      console.log('✅ Token Mapbox récupéré depuis Supabase Edge Function');
      return data.token;
    }
    
    if (error) {
      console.warn('⚠️ Erreur Edge Function Mapbox:', error);
    }
    
    // 3. Fallback vers localStorage si l'API n'est pas disponible
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
  // 1. Vérifier window.__MAPBOX_TOKEN__ en premier
  if (typeof window !== 'undefined' && (window as any).__MAPBOX_TOKEN__) {
    const windowToken = (window as any).__MAPBOX_TOKEN__;
    if (windowToken && windowToken.startsWith('pk.')) {
      return windowToken;
    }
  }
  
  // 2. Fallback vers localStorage
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
