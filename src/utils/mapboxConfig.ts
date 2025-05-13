
/**
 * Configuration centralisée pour Mapbox
 */
import React from "react";

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg";

/**
 * Récupère le token Mapbox en priorité depuis les variables d'environnement
 */
export const getMapboxToken = (): string => {
  if (!MAPBOX_TOKEN) {
    console.error("❌ Le token Mapbox est manquant !");
    return "";
  }
  return MAPBOX_TOKEN;
};

/**
 * Vérifie si le token Mapbox est valide
 */
export const isMapboxTokenValid = (): boolean => {
  return !!getMapboxToken();
};

/**
 * Message d'erreur affiché si le token est manquant
 */
export const MapboxErrorMessage: React.FC = () => (
  <div className="p-4 text-red-600 font-semibold text-sm bg-red-100 rounded-md">
    ❌ Le token Mapbox est manquant ou invalide. Veuillez vérifier vos variables d'environnement.
  </div>
);
