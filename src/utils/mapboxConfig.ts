
import React from "react";

// ✅ 1. Récupération sécurisée du token (priorité à l'environnement)
const ENV_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const FALLBACK_TOKEN = "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg";

/**
 * ✅ Retourne le token Mapbox en priorisant la variable d'environnement
 */
export const getMapboxToken = (): string => {
  const token = ENV_TOKEN?.trim() || FALLBACK_TOKEN;
  if (!token || token.length < 60) {
    console.warn("⚠️ Mapbox token invalide ou absent.");
  }
  return token;
};

/**
 * ✅ Vérifie si le token est a priori utilisable
 */
export const isMapboxTokenValid = (): boolean => {
  const token = getMapboxToken();
  return !!token && token.length > 60;
};

/**
 * ✅ Composant visuel d'erreur si Mapbox échoue à se charger
 */
export const MapboxErrorMessage: React.FC = () => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
    <strong className="font-bold">Erreur :</strong>
    <span className="block sm:inline"> le token Mapbox est manquant ou invalide.</span>
  </div>
);
