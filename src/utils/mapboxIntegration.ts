
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { getMapboxToken } from './mapboxConfig';
import { TransportMode } from '@/types';
import { 
  directionsService, 
  matrixService, 
  getDirections,
  getDistanceMatrix
} from './mapboxSdk';

// Convertir le mode de transport interne en profil Mapbox
const transportModeToProfile = (mode: TransportMode): 'driving' | 'walking' | 'cycling' => {
  switch (mode) {
    case 'car': return 'driving';
    case 'walking': return 'walking';
    case 'cycling': return 'cycling';
    case 'bus':
    case 'transit': return 'driving'; // Fallback car Mapbox n'a pas de profil transit
    default: return 'driving';
  }
};

// Calculer l'itinéraire entre deux points
export const calculateRoute = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: TransportMode = 'car'
) => {
  try {
    const profile = transportModeToProfile(transportMode);
    const directions = await getDirections(origin, destination, profile);
    
    if (!directions || !directions.routes || directions.routes.length === 0) {
      throw new Error('Aucun itinéraire trouvé');
    }
    
    const route = directions.routes[0];
    
    return {
      route: route,
      distance: route.distance, // en mètres
      duration: route.duration, // en secondes
      geometry: route.geometry
    };
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire:', error);
    throw error;
  }
};

// Calculer plusieurs itinéraires depuis une origine vers plusieurs destinations
export const calculateMultipleRoutes = async (
  origin: [number, number],
  destinations: Array<[number, number]>,
  transportMode: 'car' | 'walking' | 'cycling' = 'car'
) => {
  try {
    const profile = transportModeToProfile(transportMode as TransportMode);
    
    // Si nous n'avons qu'une seule destination, utiliser calculateRoute
    if (destinations.length === 1) {
      const result = await calculateRoute(origin, destinations[0], transportMode as TransportMode);
      return [result];
    }
    
    // Pour plusieurs destinations, d'abord essayer l'API Matrix pour l'efficacité
    // Cette API donne les distances et durées mais pas les géométries
    const matrixResult = await getDistanceMatrix([origin], destinations, profile);
    
    // Ensuite, récupérer les itinéraires individuels pour les géométries
    const routePromises = destinations.map(destination => 
      getDirections(origin, destination, profile)
    );
    
    const routeResults = await Promise.all(routePromises);
    
    // Combiner les résultats
    return destinations.map((destination, index) => {
      const distance = matrixResult.distances?.[0]?.[index] || 0;
      const duration = matrixResult.durations?.[0]?.[index] || 0;
      const geometry = routeResults[index]?.routes?.[0]?.geometry || null;
      
      return {
        route: {
          distance,
          duration,
          geometry
        },
        distance,
        duration,
        geometry
      };
    });
  } catch (error) {
    console.error('Erreur lors du calcul des itinéraires multiples:', error);
    // Fallback: calculer chaque itinéraire individuellement
    try {
      const routePromises = destinations.map(destination => 
        calculateRoute(origin, destination, transportMode as TransportMode)
      );
      return await Promise.all(routePromises);
    } catch (fallbackError) {
      console.error('Erreur lors du calcul des itinéraires de secours:', fallbackError);
      throw fallbackError;
    }
  }
};

// Calculer le rayon d'un cercle en degrés (pour l'affichage sur la carte)
export const calculateRadiusInDegrees = (center: [number, number], radiusKm: number) => {
  // Créer un point avec turf.js
  const point = turf.point(center);
  // Créer un cercle avec le rayon spécifié (en kilomètres)
  const circle = turf.circle(point, radiusKm, { units: 'kilometers' });
  // Obtenir la boîte englobante
  const bbox = turf.bbox(circle);
  // Calculer le rayon en degrés (approximativement)
  const radiusLng = Math.abs(bbox[2] - center[0]);
  const radiusLat = Math.abs(bbox[3] - center[1]);
  // Retourner la moyenne (approximation)
  return (radiusLng + radiusLat) / 2;
};

// Vérifier si un point est dans un rayon donné
export const isPointInRadius = (
  center: [number, number],
  point: [number, number],
  radiusKm: number
) => {
  const from = turf.point(center);
  const to = turf.point(point);
  const distance = turf.distance(from, to, { units: 'kilometers' });
  return distance <= radiusKm;
};

// Convertir les unités
export const convertDistance = (distance: number, fromUnit: 'km' | 'mi', toUnit: 'km' | 'mi') => {
  if (fromUnit === toUnit) return distance;
  
  if (fromUnit === 'km' && toUnit === 'mi') {
    return distance * 0.621371;
  } else {
    return distance * 1.60934;
  }
};
