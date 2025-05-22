
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
    setProfile(profile: string): void;
    on(event: string, callback: (e?: any) => void): void;
  }
}

// Fix type for MapboxGeocoder
declare module "@mapbox/mapbox-gl-geocoder" {
  import mapboxgl from "mapbox-gl";
  
  namespace MapboxGeocoder {
    interface Options {
      accessToken: string;
      mapboxgl?: typeof mapboxgl;
      marker?: boolean | object;
      proximity?: { longitude: number; latitude: number };
      placeholder?: string;
      language?: string;
      countries?: string;
      bbox?: [number, number, number, number];
      types?: string;
      minLength?: number;
      limit?: number;
      filter?: (feature: any) => boolean;
      localGeocoder?: (query: string) => any[];
      [key: string]: any;
    }
  }
  
  class MapboxGeocoder implements mapboxgl.IControl {
    constructor(options: MapboxGeocoder.Options);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    addTo(container: HTMLElement): void;
    on(event: string, callback: Function): void;
    clear(): void;
    setInput(value: string): this;
  }
  
  export default MapboxGeocoder;
}
