
/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    VITE_MAPBOX_TOKEN?: string;
    [key: string]: any;
  }
}

// Extending mapbox types
declare module "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions" {
  import mapboxgl from "mapbox-gl";
  
  export default class MapboxDirections implements mapboxgl.IControl {
    constructor(options: any);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    setOrigin(coordinates: [number, number]): void;
    setDestination(coordinates: [number, number]): void;
  }
}

// Fix type for MapboxGeocoder
declare module "@mapbox/mapbox-gl-geocoder" {
  import mapboxgl from "mapbox-gl";
  
  interface MapboxGeocoderOptions {
    accessToken: string;
    mapboxgl: typeof mapboxgl;
    marker?: boolean;
    proximity?: { longitude: number; latitude: number };
    placeholder?: string;
    language?: string;
    countries?: string;
    [key: string]: any;
  }
  
  class MapboxGeocoder implements mapboxgl.IControl {
    constructor(options: MapboxGeocoderOptions);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    addTo(container: HTMLElement): void;
    on(event: string, callback: Function): void;
    clear(): void;
  }
  
  export default MapboxGeocoder;
}
