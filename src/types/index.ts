
export interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  price?: number;
  coordinates: [number, number]; // [longitude, latitude]
  image?: string;
}

export interface MapboxConfig {
  accessToken: string;
  style: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}
