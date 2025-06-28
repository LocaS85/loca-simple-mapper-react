
export type TransportMode = 'walking' | 'cycling' | 'driving' | 'transit';
export type DistanceUnit = 'km' | 'mi';

export interface MapConfig {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface RouteOptions {
  transportMode: TransportMode;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

export interface MapboxDirectionsOptions {
  profile?: 'driving' | 'walking' | 'cycling';
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  overview?: 'full' | 'simplified' | 'false';
  steps?: boolean;
  continue_straight?: boolean;
  waypoint_snapping?: string[];
}
