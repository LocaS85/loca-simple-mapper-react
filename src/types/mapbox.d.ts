
// Types personnalisés pour Mapbox GL JS
declare module 'mapbox-gl' {
  export = mapboxgl;
}

declare module '@mapbox/mapbox-gl-geocoder' {
  import mapboxgl from 'mapbox-gl';
  
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
    addTo(container: HTMLElement | mapboxgl.Map): this;
    on(event: string, callback: Function): this;
    clear(): this;
    setInput(value: string): this;
  }
  
  export = MapboxGeocoder;
}

declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
  import mapboxgl from 'mapbox-gl';
  
  class MapboxDirections implements mapboxgl.IControl {
    constructor(options: any);
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    on(event: string, callback: (e?: any) => void): void;
    setProfile(profile: string): void;
    setOrigin(origin: [number, number]): void;
    setDestination(destination: [number, number]): void;
  }
  
  export = MapboxDirections;
}

// Extensions pour l'environnement global
declare global {
  interface Window {
    showRouteToPlace?: (placeId: string) => void;
  }
}

export {};
