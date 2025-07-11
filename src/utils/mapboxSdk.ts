
import mapboxSdk from '@mapbox/mapbox-sdk';
import mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import mapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import mapboxMatrix from '@mapbox/mapbox-sdk/services/matrix';
import { getMapboxTokenSync } from './mapboxConfig';

/**
 * Centralized configuration for Mapbox SDK services
 */

// Get token synchronously to avoid Promise issues
const getToken = (): string => {
  const token = getMapboxTokenSync();
  if (!token) {
    console.warn('No Mapbox token available - services will be disabled');
    return 'pk.placeholder'; // Placeholder to prevent crashes
  }
  return token;
};

// Create base client with authentication - use lazy initialization
let baseClient: any = null;
let geocodingServiceInstance: any = null;
let directionsServiceInstance: any = null;
let matrixServiceInstance: any = null;

const initializeServices = () => {
  if (!baseClient) {
    const token = getToken();
    baseClient = mapboxSdk({ accessToken: token });
    geocodingServiceInstance = mapboxGeocoding(baseClient);
    directionsServiceInstance = mapboxDirections(baseClient);
    matrixServiceInstance = mapboxMatrix(baseClient);
  }
};

// Initialize services
export const geocodingService = () => {
  initializeServices();
  return geocodingServiceInstance;
};

export const directionsService = () => {
  initializeServices();
  return directionsServiceInstance;
};

export const matrixService = () => {
  initializeServices();
  return matrixServiceInstance;
};

// Geocoding helpers
export const forwardGeocode = async (searchText: string) => {
  try {
    const token = getMapboxTokenSync();
    if (!token || token === 'pk.placeholder') {
      throw new Error('No valid Mapbox token available');
    }
    
    const response = await geocodingService()
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
    const token = getMapboxTokenSync();
    if (!token || token === 'pk.placeholder') {
      throw new Error('No valid Mapbox token available');
    }
    
    const response = await geocodingService()
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
    const token = getMapboxTokenSync();
    if (!token || token === 'pk.placeholder') {
      throw new Error('No valid Mapbox token available');
    }
    
    const response = await directionsService()
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
    const token = getMapboxTokenSync();
    if (!token || token === 'pk.placeholder') {
      throw new Error('No valid Mapbox token available');
    }
    
    // Matrix API has limits - check that we're within them
    if (origins.length * destinations.length > 25) {
      console.warn('Matrix API request exceeds free tier limits (25 pairs max)');
    }
    
    const response = await matrixService()
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
