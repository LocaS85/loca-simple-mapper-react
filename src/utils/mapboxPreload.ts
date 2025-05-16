
/**
 * This file ensures that Mapbox GL is properly initialized
 * with the CSS loaded from CDN and the JS properly initialized
 */

// We import mapbox-gl but not its CSS as that's loaded via CDN
import mapboxgl from 'mapbox-gl';
import { getMapboxToken } from './mapboxConfig';

export const setupMapbox = () => {
  // This function can be called during app initialization
  // to make sure Mapbox is properly set up
  try {
    const token = getMapboxToken();
    if (token) {
      mapboxgl.accessToken = token;
      console.log('Mapbox initialized successfully');
      return true;
    } else {
      console.error('Mapbox token not found');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Mapbox:', error);
    return false;
  }
};

export const isMapboxLoaded = () => {
  // Check if Mapbox CSS has been loaded from CDN
  const mapboxStylesheet = document.querySelector(
    'link[href*="api.mapbox.com/mapbox-gl-js/"]'
  );
  return !!mapboxStylesheet;
};
