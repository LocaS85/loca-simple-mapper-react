
/**
 * Configuration centralisée pour Mapbox
 */
import React from 'react';

// Your Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg";

export const getMapboxToken = (): string => {
  // Use the imported token directly, or fall back to environment variable if available
  const token = MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    console.error("Mapbox token is missing");
  }
  return token || "";
};

export const isMapboxTokenValid = (): boolean => {
  return !!getMapboxToken();
};

export const MapboxErrorMessage: React.FC = () => (
  <div className="p-4 text-red-600 font-bold">
    ❌ Le token Mapbox est manquant
  </div>
);
