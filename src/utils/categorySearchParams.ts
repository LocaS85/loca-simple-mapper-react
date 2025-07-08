/**
 * Utilitaires pour gérer les paramètres de recherche entre categories et geosearch
 */

export interface CategorySearchParams {
  category?: string;
  query?: string;
  lat?: number;
  lng?: number;
  transport?: string;
  distance?: number;
  unit?: string;
  autoSearch?: boolean;
  count?: number;
}

/**
 * Crée une URL de redirection vers GeoSearch avec les paramètres optimisés
 */
export const createGeoSearchUrl = (params: CategorySearchParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.category) searchParams.set('category', params.category);
  if (params.query) searchParams.set('query', params.query);
  if (params.lat) searchParams.set('lat', params.lat.toString());
  if (params.lng) searchParams.set('lng', params.lng.toString());
  if (params.transport) searchParams.set('transport', params.transport);
  if (params.distance) searchParams.set('distance', params.distance.toString());
  if (params.unit) searchParams.set('unit', params.unit);
  if (params.autoSearch) searchParams.set('autoSearch', 'true');
  if (params.count) searchParams.set('count', params.count.toString());
  
  return `/geosearch?${searchParams.toString()}`;
};

/**
 * Parse les paramètres URL de GeoSearch
 */
export const parseGeoSearchParams = (urlParams: URLSearchParams): CategorySearchParams => {
  return {
    category: urlParams.get('category') || undefined,
    query: urlParams.get('query') || undefined,
    lat: urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : undefined,
    lng: urlParams.get('lng') ? parseFloat(urlParams.get('lng')!) : undefined,
    transport: urlParams.get('transport') || undefined,
    distance: urlParams.get('distance') ? parseInt(urlParams.get('distance')!) : undefined,
    unit: urlParams.get('unit') || undefined,
    autoSearch: urlParams.get('autoSearch') === 'true',
    count: urlParams.get('count') ? parseInt(urlParams.get('count')!) : undefined,
  };
};

/**
 * Paramètres optimisés par défaut selon le type de recherche
 */
export const getOptimizedSearchParams = (
  type: 'quick' | 'detailed' | 'subcategory',
  baseParams: CategorySearchParams
): CategorySearchParams => {
  const defaults = {
    quick: {
      distance: 3,
      transport: 'walking',
      count: 5,
      autoSearch: true
    },
    detailed: {
      distance: 10,
      transport: 'driving',
      count: 15,
      autoSearch: true
    },
    subcategory: {
      distance: 5,
      transport: 'walking',
      count: 8,
      autoSearch: true
    }
  };

  return {
    ...baseParams,
    ...defaults[type],
    unit: 'km'
  };
};