
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
