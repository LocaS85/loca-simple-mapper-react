
// Types personnalisés pour Mapbox GL JS
declare module 'mapbox-gl' {
  export = mapboxgl;
}

declare module '@mapbox/mapbox-gl-geocoder' {
  interface MapboxGeocoder {
    new (options: any): any;
  }
  const MapboxGeocoder: MapboxGeocoder;
  export = MapboxGeocoder;
}

declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
  interface MapboxDirections {
    new (options: any): any;
    on(event: string, callback: (e?: any) => void): void;
    setProfile(profile: string): void;
    setOrigin(origin: [number, number]): void;
    setDestination(destination: [number, number]): void;
  }
  const MapboxDirections: MapboxDirections;
  export = MapboxDirections;
}

// Extensions pour l'environnement global
declare global {
  interface Window {
    showRouteToPlace?: (placeId: string) => void;
  }
}

export {};
