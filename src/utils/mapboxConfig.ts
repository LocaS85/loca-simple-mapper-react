
export const getMapboxToken = (): string => {
  return import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4yaXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';
};

export const isMapboxTokenValid = (): boolean => {
  const token = getMapboxToken();
  return token && token.startsWith('pk.');
};

// Export des constantes manquantes
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 13;

// Fonction pour sauvegarder le token
export const saveMapboxToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('MAPBOX_TOKEN', token);
  }
};

// Fonction pour récupérer le token sauvegardé
export const getSavedMapboxToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('MAPBOX_TOKEN');
  }
  return null;
};
