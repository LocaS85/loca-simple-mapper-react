
export type TransportMode = 'walking' | 'driving' | 'cycling' | 'transit';
export type DistanceUnit = 'km' | 'mi';

export interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  address?: string;
  category?: string;
}

export interface MapFilters {
  transport: TransportMode;
  distance: number;
  unit: DistanceUnit;
  category?: string;
}
