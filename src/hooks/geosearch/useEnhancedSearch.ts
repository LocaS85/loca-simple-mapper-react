
import { useCallback, useEffect, useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { SearchResult } from '@/types/geosearch';

interface GeocoderResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties?: any;
  context?: any[];
}

export const useEnhancedSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { 
    updateFilters, 
    setUserLocation, 
    performSearch, 
    isMapboxReady,
    userLocation,
    filters
  } = useGeoSearchStore();

  // Gérer la sélection de résultat du geocoder
  const handleGeocoderResult = useCallback(async (result: GeocoderResult) => {
    console.log('🔍 Traitement du résultat geocoder:', result);
    
    // Mettre à jour la position utilisateur
    setUserLocation(result.center);
    
    // Extraire la catégorie du résultat si possible
    const category = extractCategoryFromResult(result);
    
    // Mettre à jour les filtres
    const newFilters: any = { 
      query: result.text 
    };
    
    if (category) {
      newFilters.category = category;
    }
    
    updateFilters(newFilters);
    
    // Ajouter à l'historique
    setSearchHistory(prev => {
      const newHistory = [result.text, ...prev.filter(item => item !== result.text)];
      return newHistory.slice(0, 10); // Garder seulement les 10 derniers
    });
    
    // Déclencher la recherche
    if (isMapboxReady) {
      await performSearch(result.text);
    }
  }, [updateFilters, setUserLocation, performSearch, isMapboxReady]);

  // Recherche directe par texte
  const handleDirectSearch = useCallback(async (query: string) => {
    console.log('🔍 Recherche directe:', query);
    
    if (!userLocation || !isMapboxReady) {
      console.warn('Impossible de faire la recherche: localisation ou Mapbox non disponible');
      return;
    }

    updateFilters({ query });
    await performSearch(query);
    
    // Ajouter à l'historique
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)];
      return newHistory.slice(0, 10);
    });
  }, [updateFilters, performSearch, userLocation, isMapboxReady]);

  // Changer de localisation
  const handleLocationChange = useCallback(async (coordinates: [number, number]) => {
    console.log('📍 Changement de localisation:', coordinates);
    
    setUserLocation(coordinates);
    
    // Relancer la recherche avec la nouvelle localisation si on a une requête
    if (filters.query && isMapboxReady) {
      await performSearch(filters.query);
    }
  }, [setUserLocation, performSearch, filters.query, isMapboxReady]);

  // Effacer l'historique
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    handleGeocoderResult,
    handleDirectSearch,
    handleLocationChange,
    searchHistory,
    clearSearchHistory
  };
};

// Fonction utilitaire pour extraire la catégorie d'un résultat Mapbox
function extractCategoryFromResult(result: GeocoderResult): string | undefined {
  // Extraire depuis les propriétés
  if (result.properties?.category) {
    return result.properties.category;
  }
  
  // Extraire depuis les types de lieu
  const placeTypes = result.properties?.categories || [];
  if (placeTypes.length > 0) {
    return placeTypes[0];
  }
  
  // Inférer depuis le nom du lieu
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
