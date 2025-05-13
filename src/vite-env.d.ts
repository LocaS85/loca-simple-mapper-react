
/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    VITE_MAPBOX_TOKEN?: string;
    [key: string]: any;
  }
}

// Extending mapbox types
declare module "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions" {
  export default class MapboxDirections {
    constructor(options: any);
    setOrigin(coordinates: [number, number]): void;
    setDestination(coordinates: [number, number]): void;
  }
}

// Fix type for MapboxGeocoder
declare module "@mapbox/mapbox-gl-geocoder" {
  import mapboxgl from "mapbox-gl";
  
  interface MapboxGeocoderOptions {
    accessToken: string;
    mapboxgl: any;
    marker?: boolean;
    proximity?: { longitude: number; latitude: number };
    placeholder?: string;
    language?: string;
    countries?: string;
    [key: string]: any;
  }
  
  class MapboxGeocoder {
    constructor(options: MapboxGeocoderOptions);
    addTo(container: HTMLElement): void;
    on(event: string, callback: Function): void;
    clear(): void;
  }
  
  export default MapboxGeocoder;
}
