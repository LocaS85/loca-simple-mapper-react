
/**
 * Point d'intérêt (POI) pour l'affichage sur la carte
 */
export interface POI {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number]; // [longitude, latitude]
  description?: string;
  address?: string;
  rating?: number;
  // Champs ajoutés pour améliorer l'affichage
  color?: string;
  icon?: string;
  imageUrl?: string;
}

/**
 * Type pour la référence à la carte Mapbox
 */
export interface MapRef {
  getMap: () => mapboxgl.Map;
}
