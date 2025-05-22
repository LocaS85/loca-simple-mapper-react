
import mapboxSdk from '@mapbox/mapbox-sdk';
import mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import mapboxMatrix from '@mapbox/mapbox-sdk/services/matrix';
import { getMapboxToken } from './mapboxConfig';

/**
 * Centralized configuration for Mapbox SDK services
 */

// Create base client with authentication
const baseClient = mapboxSdk({ accessToken: getMapboxToken() });

// Initialize geocoding service
export const geocodingService = mapboxGeocoding(baseClient);

// Initialize directions service
export const directionsService = mapboxDirections(baseClient);

// Initialize matrix service
export const matrixService = mapboxMatrix(baseClient);

// Geocoding helpers
export const forwardGeocode = async (searchText: string) => {
  try {
    const response = await geocodingService
      .forwardGeocode({
        query: searchText,
        limit: 5,
        countries: ['fr'],
        language: ['fr']
      })
      .send();
      
    return response.body.features;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    throw error;
  }
};

export const reverseGeocode = async (coordinates: [number, number]) => {
  try {
    const response = await geocodingService
      .reverseGeocode({
        query: coordinates,
        limit: 1,
        language: ['fr']
      })
      .send();
      
    return response.body.features[0];
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

// Directions helpers
export const getDirections = async (
  origin: [number, number],
  destination: [number, number],
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
) => {
  try {
    const response = await directionsService
      .getDirections({
        profile: `mapbox/${mode}`,
        waypoints: [
          { coordinates: origin },
          { coordinates: destination }
        ],
        geometries: 'geojson',
        overview: 'full',
        steps: true,
        language: 'fr'
      })
      .send();
      
    return response.body;
  } catch (error) {
    console.error('Directions error:', error);
    throw error;
  }
};

// Matrix helpers (for calculating multiple routes simultaneously)
export const getDistanceMatrix = async (
  origins: Array<[number, number]>,
  destinations: Array<[number, number]>,
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
) => {
  try {
    // Matrix API has limits - check that we're within them
    if (origins.length * destinations.length > 25) {
      console.warn('Matrix API request exceeds free tier limits (25 pairs max)');
    }
    
    const response = await matrixService
      .getMatrix({
        profile: `mapbox/${mode}`,
        sources: origins.map(coordinates => ({ coordinates })),
        destinations: destinations.map(coordinates => ({ coordinates })),
        annotations: ['duration', 'distance']
      })
      .send();
      
    return response.body;
  } catch (error) {
    console.error('Matrix API error:', error);
    throw error;
  }
};
