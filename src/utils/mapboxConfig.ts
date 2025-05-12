
/**
 * Configuration centralisée pour Mapbox
 */
import React from 'react';

export const getMapboxToken = (): string => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    console.error("VITE_MAPBOX_TOKEN is missing in your .env file");
  }
  return token || "";
};

export const isMapboxTokenValid = (): boolean => {
  return !!getMapboxToken();
};

export const MapboxErrorMessage = () => (
  <div className="p-4 text-red-600 font-bold">
    ❌ Le token Mapbox est manquant dans votre fichier .env
  </div>
);
