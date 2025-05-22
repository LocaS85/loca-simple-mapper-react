
/**
 * Mapbox Integration - Configuration centralisée pour tous les outils Mapbox
 */
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as turf from '@turf/turf';
import { getMapboxToken, DEFAULT_MAP_CENTER } from './mapboxConfig';

// Exporter turf pour faciliter les calculs géospatiaux
export { turf };

/**
 * Initialise les services Mapbox de base
 */
export const initMapbox = () => {
  const token = getMapboxToken();
  if (!token) {
    console.error('Mapbox token manquant');
    return false;
  }
  
  mapboxgl.accessToken = token;
  return true;
};

/**
 * Crée un géocodeur Mapbox pour la recherche d'adresses
 */
export const createGeocoder = (options: {
  placeholder?: string;
  proximity?: { longitude: number; latitude: number };
  language?: string;
  countries?: string;
  mapboxgl?: any;
  marker?: boolean;
}) => {
  const {
    placeholder = 'Rechercher une adresse...',
    proximity,
    language = 'fr',
    countries = 'fr',
    marker = false,
  } = options;

  return new MapboxGeocoder({
    accessToken: getMapboxToken(),
    mapboxgl: mapboxgl,
    placeholder,
    proximity,
    language,
    countries,
    marker
  });
};

/**
 * Crée un contrôle de directions pour les itinéraires
 */
export const createDirections = (options: {
  profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling' | 'mapbox/driving-traffic';
  alternatives?: boolean;
  congestion?: boolean;
  controls?: {
    inputs?: boolean;
    instructions?: boolean;
    profileSwitcher?: boolean;
  };
  language?: string;
}) => {
  const {
    profile = 'mapbox/driving',
    alternatives = true,
    congestion = true,
    controls = { inputs: true, instructions: false, profileSwitcher: true },
    language = 'fr-FR'
  } = options;

  return new MapboxDirections({
    accessToken: getMapboxToken(),
    unit: 'metric',
    profile,
    alternatives,
    congestion,
    language,
    controls
  });
};

/**
 * Calcule une isochrone (zone accessible dans un certain temps) autour d'un point
 * Utilise Turf.js pour un calcul approximatif côté client
 */
export const calculateIsochroneWithTurf = (
  center: [number, number],
  radiusInKm: number,
  options?: {
    steps?: number;
    units?: 'kilometers' | 'miles';
  }
) => {
  const { steps = 64, units = 'kilometers' } = options || {};
  
  // Créer un cercle avec Turf.js
  const circle = turf.circle(center, radiusInKm, {
    steps,
    units
  });
  
  return circle;
};

/**
 * Convertit un mode de transport en profil Mapbox
 */
export const transportModeToMapboxProfile = (
  mode: 'car' | 'walking' | 'cycling' | 'transit'
): 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling' | 'mapbox/driving-traffic' => {
  switch (mode) {
    case 'car': return 'mapbox/driving';
    case 'walking': return 'mapbox/walking';
    case 'cycling': return 'mapbox/cycling';
    case 'transit': return 'mapbox/driving'; // Mapbox n'a pas de transit natif, utilisé comme fallback
    default: return 'mapbox/driving';
  }
};

/**
 * Crée un marqueur personnalisé
 */
export const createCustomMarker = (
  color: string = '#3b82f6', 
  size: number = 15,
  className: string = ''
): HTMLElement => {
  const el = document.createElement('div');
  el.className = `custom-marker ${className}`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.backgroundColor = color;
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
  
  return el;
};

/**
 * Utilitaire pour ajouter des contrôles standard à une carte
 */
export const addStandardControls = (map: mapboxgl.Map) => {
  // Ajouter contrôles de navigation
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
  // Ajouter contrôle de géolocalisation
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }),
    'top-right'
  );
  
  // Ajouter contrôle d'échelle
  map.addControl(
    new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }),
    'bottom-right'
  );
};

/**
 * Ajoute un cercle de rayon autour d'un point central
 */
export const addRadiusCircle = (
  map: mapboxgl.Map,
  center: [number, number],
  radiusInKm: number,
  color: string = '#3b82f6',
  id: string = 'radius-circle'
) => {
  // Vérifier si la source existe déjà
  if (map.getSource(id)) {
    // Mettre à jour les coordonnées du cercle
    const source = map.getSource(id) as mapboxgl.GeoJSONSource;
    source.setData(turf.point(center).geometry);
  } else {
    // Créer une nouvelle source
    map.addSource(id, {
      type: 'geojson',
      data: turf.point(center)
    });
    
    // Ajouter la couche de cercle
    map.addLayer({
      id: id,
      type: 'circle',
      source: id,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          // Formule pour convertir km en pixels à différents niveaux de zoom
          10, radiusInKm * 1000 / (111320 * Math.cos(center[1] * Math.PI / 180)) * 0.5,
          15, radiusInKm * 1000 / (111320 * Math.cos(center[1] * Math.PI / 180)) * 4
        ],
        'circle-color': color,
        'circle-opacity': 0.2,
        'circle-stroke-width': 2,
        'circle-stroke-color': color,
        'circle-stroke-opacity': 0.5
      }
    });
  }
};

/**
 * Calcule des itinéraires entre un point central et plusieurs destinations
 */
export const calculateMultipleRoutes = async (
  center: [number, number],
  destinations: [number, number][],
  mode: 'car' | 'walking' | 'cycling' = 'car'
) => {
  // Implémentation basique avec API publique de Mapbox Directions
  // Remarque : pour une utilisation avancée ou à grande échelle, utiliser Matrix API
  const results = [];
  const profile = transportModeToMapboxProfile(mode);
  const token = getMapboxToken();
  
  for (const dest of destinations) {
    try {
      const url = `https://api.mapbox.com/directions/v5/${profile}/${center[0]},${center[1]};${dest[0]},${dest[1]}?geometries=geojson&access_token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        results.push({
          route: data.routes[0],
          destination: dest,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration
        });
      }
    } catch (error) {
      console.error('Erreur de calcul d\'itinéraire:', error);
    }
  }
  
  return results;
};

// Ajouter d'autres utilitaires Mapbox selon les besoins
