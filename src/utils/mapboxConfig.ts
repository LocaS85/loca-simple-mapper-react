
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

export const getMapboxToken = (): string => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';
  return token;
};

export const isMapboxTokenValid = (): boolean => {
  const token = getMapboxToken();
  return !!(token && token.startsWith('pk.'));
};
