
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';
import { GeoSearchFilters } from '@/types/geosearch';

// Service de synchronisation des filtres
export const filterSyncService = {
  // Convertir UnifiedFilters vers GeoSearchFilters
  unifiedToGeoSearch: (unified: UnifiedFilters): GeoSearchFilters => ({
    category: unified.category,
    subcategory: unified.subcategory,
    transport: unified.transport,
    distance: unified.distance,
    unit: unified.unit,
    query: unified.query,
    aroundMeCount: unified.aroundMeCount,
    showMultiDirections: unified.showMultiDirections,
    maxDuration: unified.maxDuration
  }),

  // Convertir GeoSearchFilters vers UnifiedFilters
  geoSearchToUnified: (geoSearch: GeoSearchFilters): UnifiedFilters => ({
    category: geoSearch.category,
    subcategory: geoSearch.subcategory,
    transport: geoSearch.transport,
    distance: geoSearch.distance,
    unit: geoSearch.unit,
    query: geoSearch.query,
    aroundMeCount: geoSearch.aroundMeCount,
    showMultiDirections: geoSearch.showMultiDirections,
    maxDuration: geoSearch.maxDuration
  }),

  // Valider les filtres avant API call
  validateFilters: (filters: UnifiedFilters | GeoSearchFilters): boolean => {
    if (!filters) return false;
    if (filters.distance <= 0 || filters.distance > 100) return false;
    if (filters.aroundMeCount <= 0 || filters.aroundMeCount > 20) return false;
    if (filters.maxDuration <= 0 || filters.maxDuration > 120) return false;
    return true;
  },

  // Préparer les paramètres pour l'API
  prepareApiParams: (filters: UnifiedFilters, userLocation: [number, number] | null) => {
    if (!userLocation || !filterSyncService.validateFilters(filters)) {
      return null;
    }

    return {
      ...filters,
      center: userLocation,
      // S'assurer que query n'est pas vide pour l'API Mapbox
      query: filters.query || filters.category || 'point of interest'
    };
  }
};
