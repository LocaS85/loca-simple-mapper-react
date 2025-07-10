import { SearchResult } from '@/types/geosearch';

/**
 * Utilitaires pour la construction et manipulation de GeoJSON
 */

export interface RouteGeoJSON {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: number[][];
    };
    properties: {
      transport: string;
      duration: number;
      distance: number;
      color: string;
    };
  }>;
}

export interface MarkersGeoJSON {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: {
      id: string;
      name: string;
      address?: string;
      category?: string;
      markerType: 'result' | 'user';
      index?: number;
    };
  }>;
}

/**
 * Convertit les résultats de recherche en GeoJSON pour les marqueurs
 */
export const createMarkersGeoJSON = (
  results: SearchResult[],
  userLocation?: [number, number] | null
): MarkersGeoJSON => {
  const features = [];

  // Ajouter marqueur utilisateur
  if (userLocation) {
    features.push({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: userLocation
      },
      properties: {
        id: 'user-location',
        name: 'Ma position',
        markerType: 'user' as const
      }
    });
  }

  // Ajouter marqueurs des résultats
  results.forEach((result, index) => {
    features.push({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: result.coordinates
      },
      properties: {
        id: result.id,
        name: result.name,
        address: result.address,
        category: result.category,
        markerType: 'result' as const,
        index: index + 1
      }
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
};

/**
 * Crée un GeoJSON de route à partir de coordonnées
 */
export const createRouteGeoJSON = (
  coordinates: number[][],
  transport: string,
  duration: number,
  distance: number,
  color: string
): RouteGeoJSON => {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates
      },
      properties: {
        transport,
        duration,
        distance,
        color
      }
    }]
  };
};

/**
 * Combine plusieurs routes en un seul GeoJSON
 */
export const combineRoutesGeoJSON = (routes: RouteGeoJSON[]): RouteGeoJSON => {
  const allFeatures = routes.flatMap(route => route.features);
  
  return {
    type: 'FeatureCollection',
    features: allFeatures
  };
};

/**
 * Calcule les bounds (limites) d'un ensemble de coordonnées
 */
export const calculateBounds = (coordinates: [number, number][]): {
  southwest: [number, number];
  northeast: [number, number];
} => {
  if (coordinates.length === 0) {
    return {
      southwest: [0, 0],
      northeast: [0, 0]
    };
  }

  let minLng = coordinates[0][0];
  let maxLng = coordinates[0][0];
  let minLat = coordinates[0][1];
  let maxLat = coordinates[0][1];

  coordinates.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });

  return {
    southwest: [minLng, minLat],
    northeast: [maxLng, maxLat]
  };
};

/**
 * Convertit une distance en mètres vers l'unité demandée
 */
export const convertDistance = (
  distanceInMeters: number, 
  unit: 'km' | 'miles'
): number => {
  if (unit === 'miles') {
    return distanceInMeters * 0.000621371; // mètres vers miles
  }
  return distanceInMeters / 1000; // mètres vers kilomètres
};

/**
 * Formate une distance avec l'unité appropriée
 */
export const formatDistance = (
  distance: number, 
  unit: 'km' | 'miles'
): string => {
  const converted = convertDistance(distance, unit);
  
  if (converted < 1) {
    const meters = Math.round(distance);
    return `${meters} m`;
  }
  
  return `${converted.toFixed(1)} ${unit}`;
};

/**
 * Calcule le centre géographique d'un ensemble de points
 */
export const calculateCenter = (coordinates: [number, number][]): [number, number] => {
  if (coordinates.length === 0) return [0, 0];
  
  const sum = coordinates.reduce(
    (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
    [0, 0]
  );
  
  return [sum[0] / coordinates.length, sum[1] / coordinates.length];
};

/**
 * Validation GeoJSON
 */
export const isValidGeoJSON = (geojson: any): boolean => {
  try {
    return (
      geojson &&
      typeof geojson === 'object' &&
      geojson.type === 'FeatureCollection' &&
      Array.isArray(geojson.features)
    );
  } catch {
    return false;
  }
};