
// Configuration constants for GeoSearch
export const GEOSEARCH_CONFIG = {
  DEFAULT_SEARCH_RADIUS: 10,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: 300,
  MAP_ZOOM_LEVELS: {
    CITY: 12,
    NEIGHBORHOOD: 15,
    STREET: 18
  },
  TRANSPORT_SPEEDS: {
    walking: 5, // km/h
    cycling: 15,
    driving: 30,
    transit: 20
  }
} as const;

export const SEARCH_CATEGORIES = [
  'restaurant',
  'shopping',
  'health',
  'entertainment',
  'transport',
  'services'
] as const;

export type SearchCategory = typeof SEARCH_CATEGORIES[number];
