
import { useMemo } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { POI } from '@/types/map';

export const usePOIIntegration = () => {
  const { results, userLocation } = useGeoSearchStore();

  // Convertir les résultats de recherche en POI pour les composants de carte
  const pointsOfInterest = useMemo((): POI[] => {
    return results.map((result, index) => ({
      id: result.id,
      name: result.name,
      coordinates: result.coordinates,
      category: result.category || result.type || 'general',
      description: result.address,
      distance: result.distance,
      duration: result.duration
    }));
  }, [results]);

  // Calculer les limites pour le clustering
  const bounds = useMemo(() => {
    if (!userLocation || pointsOfInterest.length === 0) {
      return [-180, -90, 180, 90] as [number, number, number, number];
    }

    let minLng = userLocation[0];
    let minLat = userLocation[1];
    let maxLng = userLocation[0];
    let maxLat = userLocation[1];

    pointsOfInterest.forEach(poi => {
      minLng = Math.min(minLng, poi.coordinates[0]);
      minLat = Math.min(minLat, poi.coordinates[1]);
      maxLng = Math.max(maxLng, poi.coordinates[0]);
      maxLat = Math.max(maxLat, poi.coordinates[1]);
    });

    // Ajouter une marge
    const margin = 0.01;
    return [
      minLng - margin,
      minLat - margin,
      maxLng + margin,
      maxLat + margin
    ] as [number, number, number, number];
  }, [userLocation, pointsOfInterest]);

  return {
    pointsOfInterest,
    bounds,
    userLocation,
    resultsCount: results.length
  };
};
