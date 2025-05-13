
export interface POI {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number]; // [longitude, latitude]
  description?: string;
}
