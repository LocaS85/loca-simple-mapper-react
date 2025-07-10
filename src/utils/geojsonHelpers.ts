import { SearchResult } from '@/types/geosearch';
import { TransportMode, CoordinatesPair } from '@/types/map';

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Créer un GeoJSON point pour un résultat de recherche
 */
export const createPointFeature = (result: SearchResult, index?: number): GeoJSONFeature => {
  return {
    type: 'Feature',
    properties: {
      id: result.id,
      name: result.name,
      address: result.address,
      category: result.category,
      type: result.type,
      distance: result.distance,
      duration: result.duration,
      rating: result.rating,
      phone: result.phone,
      website: result.website,
      openingHours: result.openingHours,
      price: result.price,
      index: index || 0
    },
    geometry: {
      type: 'Point',
      coordinates: result.coordinates
    }
  };
};

/**
 * Créer un GeoJSON LineString pour un trajet
 */
export const createRouteFeature = (
  coordinates: number[][],
  properties: {
    id: string;
    transport: TransportMode;
    distance: number;
    duration: number;
    destinationId: string;
    destinationName: string;
  }
): GeoJSONFeature => {
  return {
    type: 'Feature',
    properties: {
      ...properties,
      type: 'route'
    },
    geometry: {
      type: 'LineString',
      coordinates
    }
  };
};

/**
 * Créer un GeoJSON pour l'utilisateur
 */
export const createUserLocationFeature = (location: CoordinatesPair): GeoJSONFeature => {
  return {
    type: 'Feature',
    properties: {
      id: 'user-location',
      name: 'Ma position',
      type: 'user-location',
      isUserLocation: true
    },
    geometry: {
      type: 'Point',
      coordinates: location
    }
  };
};

/**
 * Créer une collection GeoJSON complète avec résultats et trajets
 */
export const createGeoJSONCollection = (
  results: SearchResult[],
  userLocation?: CoordinatesPair,
  routes?: Array<{
    id: string;
    coordinates: number[][];
    transport: TransportMode;
    distance: number;
    duration: number;
    destination: SearchResult;
  }>
): GeoJSONCollection => {
  const features: GeoJSONFeature[] = [];

  // Ajouter la position utilisateur
  if (userLocation) {
    features.push(createUserLocationFeature(userLocation));
  }

  // Ajouter les résultats comme points
  results.forEach((result, index) => {
    features.push(createPointFeature(result, index));
  });

  // Ajouter les trajets comme lignes
  if (routes) {
    routes.forEach(route => {
      features.push(createRouteFeature(route.coordinates, {
        id: route.id,
        transport: route.transport,
        distance: route.distance,
        duration: route.duration,
        destinationId: route.destination.id,
        destinationName: route.destination.name
      }));
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
};

/**
 * Calculer les limites (bounding box) d'une collection GeoJSON
 */
export const calculateBounds = (geojson: GeoJSONCollection): [number, number, number, number] => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  geojson.features.forEach(feature => {
    if (feature.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    } else if (feature.geometry.type === 'LineString') {
      feature.geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      });
    }
  });

  return [minLng, minLat, maxLng, maxLat];
};

/**
 * Filtrer les résultats par distance depuis un point
 */
export const filterResultsByDistance = (
  results: SearchResult[],
  center: CoordinatesPair,
  maxDistance: number
): SearchResult[] => {
  return results.filter(result => {
    if (!result.distance) return true; // Garder si distance non calculée
    return result.distance <= maxDistance;
  });
};

/**
 * Convertir une distance en degrés approximatifs (pour filtrage rapide)
 */
export const distanceToApproxDegrees = (distanceKm: number): number => {
  // 1 degré latitude ≈ 111 km
  return distanceKm / 111;
};

/**
 * Calculer la distance haversine entre deux points
 */
export const calculateHaversineDistance = (
  point1: CoordinatesPair,
  point2: CoordinatesPair
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLng = (point2[0] - point1[0]) * Math.PI / 180;
  const lat1 = point1[1] * Math.PI / 180;
  const lat2 = point2[1] * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

/**
 * Créer un GeoJSON simplifié pour export
 */
export const createExportGeoJSON = (
  results: SearchResult[],
  userLocation?: CoordinatesPair,
  includeDetails = true
): GeoJSONCollection => {
  const features: GeoJSONFeature[] = [];

  if (userLocation) {
    features.push({
      type: 'Feature',
      properties: {
        type: 'user-location',
        name: 'Position de départ'
      },
      geometry: {
        type: 'Point',
        coordinates: userLocation
      }
    });
  }

  results.forEach((result, index) => {
    const properties: Record<string, any> = {
      index: index + 1,
      name: result.name,
      address: result.address,
      category: result.category
    };

    if (includeDetails) {
      if (result.distance) properties.distance = `${result.distance.toFixed(2)} km`;
      if (result.duration) {
        const duration = typeof result.duration === 'number' ? result.duration : parseFloat(result.duration.toString()) || 0;
        properties.duration = `${duration.toFixed(0)} min`;
      }
      if (result.rating) properties.rating = result.rating;
      if (result.phone) properties.phone = result.phone;
      if (result.website) properties.website = result.website;
    }

    features.push({
      type: 'Feature',
      properties,
      geometry: {
        type: 'Point',
        coordinates: result.coordinates
      }
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
};