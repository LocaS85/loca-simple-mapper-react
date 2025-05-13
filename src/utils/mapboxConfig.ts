
/**
 * Configuration centralisée pour Mapbox
 */
export const getMapboxToken = (): string => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    console.error("❌ Le token Mapbox est manquant. Vérifie ton fichier .env");
  }
  return token || "";
};

export const isMapboxTokenValid = (): boolean => {
  return !!getMapboxToken();
};
