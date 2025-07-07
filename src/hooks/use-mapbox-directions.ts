import { useState, useCallback, useRef } from 'react';
import { TransportMode, CoordinatesPair } from '@/types/map';
import { SearchResult } from '@/types/geosearch';
import { getMapboxToken } from '@/utils/mapboxConfig';

export interface DirectionRoute {
  id: string;
  coordinates: number[][];
  distance: number;
  duration: number;
  destination: SearchResult;
  geometry: any;
}

export interface UseMapboxDirectionsOptions {
  transport: TransportMode;
  alternatives?: boolean;
  overview?: 'full' | 'simplified' | 'false';
}

/**
 * Hook pour gérer les directions Mapbox et les trajets multiples
 */
export const useMapboxDirections = () => {
  const [routes, setRoutes] = useState<DirectionRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Conversion mode transport vers profil Mapbox
  const getMapboxProfile = (transport: TransportMode): string => {
    switch (transport) {
      case 'walking': return 'walking';
      case 'cycling': return 'cycling';
      case 'driving': return 'driving';
      case 'transit': return 'driving'; // Fallback vers driving
      default: return 'driving';
    }
  };

  // Calculer un trajet unique
  const calculateRoute = useCallback(async (
    start: CoordinatesPair,
    end: CoordinatesPair,
    options: UseMapboxDirectionsOptions
  ): Promise<DirectionRoute | null> => {
    const token = getMapboxToken();
    if (!token) {
      throw new Error('Token Mapbox manquant');
    }

    const profile = getMapboxProfile(options.transport);
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?` +
      `alternatives=${options.alternatives || false}&` +
      `overview=${options.overview || 'full'}&` +
      `geometries=geojson&` +
      `access_token=${token}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API Directions: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    return {
      id: `route-${Date.now()}`,
      coordinates: route.geometry.coordinates,
      distance: route.distance / 1000, // Convertir en km
      duration: route.duration / 60, // Convertir en minutes
      destination: {
        id: `dest-${end[0]}-${end[1]}`,
        name: 'Destination',
        address: '',
        coordinates: end,
        type: 'destination',
        category: 'destination'
      },
      geometry: route.geometry
    };
  }, []);

  // Calculer trajets multiples vers plusieurs destinations
  const calculateMultipleRoutes = useCallback(async (
    start: CoordinatesPair,
    destinations: SearchResult[],
    options: UseMapboxDirectionsOptions
  ) => {
    // Annuler la requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const routePromises = destinations.map(async (destination) => {
        try {
          const route = await calculateRoute(start, destination.coordinates, options);
          if (route) {
            return {
              ...route,
              id: `route-${destination.id}`,
              destination
            };
          }
          return null;
        } catch (err) {
          console.warn(`Erreur trajet vers ${destination.name}:`, err);
          return null;
        }
      });

      const routeResults = await Promise.allSettled(routePromises);
      const validRoutes = routeResults
        .filter((result): result is PromiseFulfilledResult<DirectionRoute | null> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value!);

      setRoutes(validRoutes);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error('Erreur calcul trajets multiples:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [calculateRoute]);

  // Nettoyer les trajets
  const clearRoutes = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setRoutes([]);
    setError(null);
  }, []);

  // Obtenir un trajet par ID de destination
  const getRouteByDestination = useCallback((destinationId: string) => {
    return routes.find(route => route.destination.id === destinationId);
  }, [routes]);

  // Générer GeoJSON pour tous les trajets
  const getRoutesGeoJSON = useCallback((transport?: TransportMode) => {
    if (routes.length === 0) return null;

    return {
      type: 'FeatureCollection',
      features: routes.map(route => ({
        type: 'Feature',
        properties: {
          id: route.id,
          destinationId: route.destination.id,
          destinationName: route.destination.name,
          distance: route.distance,
          duration: route.duration,
          transport: transport || 'walking'
        },
        geometry: route.geometry
      }))
    };
  }, [routes]);

  return {
    routes,
    isLoading,
    error,
    calculateRoute,
    calculateMultipleRoutes,
    clearRoutes,
    getRouteByDestination,
    getRoutesGeoJSON,
    hasRoutes: routes.length > 0
  };
};