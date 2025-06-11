
import { useCallback } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { mapboxApiService } from '@/services/mapboxApiService';

interface GeocoderResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties?: any;
  context?: any[];
}

export const useSearchIntegration = () => {
  const { 
    updateFilters, 
    setUserLocation, 
    performSearch, 
    isMapboxReady,
    userLocation 
  } = useGeoSearchStore();

  const onSearchSelect = useCallback(async (result: GeocoderResult) => {
    console.log('🔍 Search result selected:', result);
    
    // Update user location to search result center
    setUserLocation(result.center);
    
    // Update filters with search query
    updateFilters({ 
      query: result.text,
      category: extractCategoryFromResult(result)
    });
    
    // Trigger new search with updated location and query
    if (isMapboxReady) {
      await performSearch(result.text);
    }
  }, [updateFilters, setUserLocation, performSearch, isMapboxReady]);

  const onDirectSearch = useCallback(async (query: string) => {
    console.log('🔍 Direct search:', query);
    
    if (!userLocation || !isMapboxReady) {
      console.warn('Cannot perform search: missing location or Mapbox not ready');
      return;
    }

    // Update filters and trigger search
    updateFilters({ query });
    await performSearch(query);
  }, [updateFilters, performSearch, userLocation, isMapboxReady]);

  const onLocationChange = useCallback(async (coordinates: [number, number]) => {
    console.log('📍 Location changed:', coordinates);
    
    setUserLocation(coordinates);
    
    // Re-trigger search with new location if we have a query
    const currentFilters = useGeoSearchStore.getState().filters;
    if (currentFilters.query && isMapboxReady) {
      await performSearch(currentFilters.query);
    }
  }, [setUserLocation, performSearch, isMapboxReady]);

  return {
    onSearchSelect,
    onDirectSearch,
    onLocationChange
  };
};

// Helper function to extract category from Mapbox result
function extractCategoryFromResult(result: GeocoderResult): string | undefined {
  // Extract category from properties or context
  if (result.properties?.category) {
    return result.properties.category;
  }
  
  // Extract from place type
  const placeTypes = result.properties?.categories || [];
  if (placeTypes.length > 0) {
    return placeTypes[0];
  }
  
  // Try to infer category from place name
  const placeName = result.place_name.toLowerCase();
  if (placeName.includes('restaurant') || placeName.includes('café')) {
    return 'restaurant';
  }
  if (placeName.includes('pharmacie')) {
    return 'health';
  }
  if (placeName.includes('supermarché') || placeName.includes('magasin')) {
    return 'shopping';
  }
  
  return undefined;
}
