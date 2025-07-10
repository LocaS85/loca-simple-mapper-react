import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface CategorySyncOptions {
  autoNavigate?: boolean;
  persistFilters?: boolean;
  syncLocation?: boolean;
}

/**
 * Hook pour synchroniser les catégories entre /categories et /geosearch
 * Gère la navigation seamless et la persistance des préférences
 */
export const useCategorySync = (options: CategorySyncOptions = {}) => {
  const {
    autoNavigate = true,
    persistFilters = true,
    syncLocation = true
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    filters,
    userLocation,
    updateFilters,
    setUserLocation,
    performSearch
  } = useGeoSearchStore();

  // Restaurer les filtres depuis localStorage au montage
  useEffect(() => {
    if (!persistFilters) return;

    const savedFilters = localStorage.getItem('geosearch-filters');
    const savedLocation = localStorage.getItem('geosearch-location');

    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        updateFilters(parsed);
      } catch (error) {
        console.warn('Failed to restore filters:', error);
      }
    }

    if (savedLocation && syncLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setUserLocation(parsed);
      } catch (error) {
        console.warn('Failed to restore location:', error);
      }
    }
  }, []);

  // Sauvegarder les filtres à chaque changement
  useEffect(() => {
    if (!persistFilters) return;
    
    localStorage.setItem('geosearch-filters', JSON.stringify(filters));
  }, [filters, persistFilters]);

  // Sauvegarder la localisation à chaque changement
  useEffect(() => {
    if (!persistFilters || !syncLocation || !userLocation) return;
    
    localStorage.setItem('geosearch-location', JSON.stringify(userLocation));
  }, [userLocation, persistFilters, syncLocation]);

  // Navigation vers GeoSearch avec paramètres
  const navigateToGeoSearch = useCallback((params: {
    category?: string;
    subcategory?: string;
    query?: string;
    transport?: string;
    distance?: number;
    autoSearch?: boolean;
    coordinates?: [number, number];
  } = {}) => {
    console.log('🚀 Navigation vers GeoSearch avec params:', params);

    // Mettre à jour les filtres
    const newFilters = {
      ...filters,
      category: params.category || filters.category,
      query: params.query || params.subcategory || filters.query,
      transport: (params.transport as any) || filters.transport,
      distance: params.distance || filters.distance
    };

    updateFilters(newFilters);

    // Mettre à jour la position si fournie
    if (params.coordinates) {
      setUserLocation(params.coordinates);
    }

    // Construire les paramètres URL
    const urlParams = new URLSearchParams();
    
    if (newFilters.category) urlParams.set('category', newFilters.category);
    if (newFilters.query) urlParams.set('query', newFilters.query);
    if (newFilters.transport) urlParams.set('transport', newFilters.transport);
    if (newFilters.distance) urlParams.set('distance', newFilters.distance.toString());
    if (params.autoSearch) urlParams.set('autoSearch', 'true');
    if (params.coordinates) {
      urlParams.set('lat', params.coordinates[1].toString());
      urlParams.set('lng', params.coordinates[0].toString());
    }

    // Naviguer
    if (autoNavigate) {
      const url = `/geosearch${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      navigate(url);
    }

    return urlParams.toString();
  }, [filters, autoNavigate, navigate, updateFilters, setUserLocation]);

  // Navigation vers Categories
  const navigateToCategories = useCallback(() => {
    if (autoNavigate) {
      navigate('/categories');
    }
  }, [autoNavigate, navigate]);

  // Parser les paramètres URL au montage (pour /geosearch)
  useEffect(() => {
    if (location.pathname !== '/geosearch') return;

    const urlParams = new URLSearchParams(location.search);
    const hasParams = Array.from(urlParams.keys()).length > 0;

    if (!hasParams) return;

    console.log('📥 Paramètres URL détectés:', Object.fromEntries(urlParams));

    // Extraire les paramètres
    const category = urlParams.get('category');
    const query = urlParams.get('query');
    const transport = urlParams.get('transport');
    const distance = urlParams.get('distance');
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    const autoSearch = urlParams.get('autoSearch');

    // Mettre à jour les filtres
    const newFilters: any = {};
    if (category) newFilters.category = category;
    if (query) newFilters.query = query;
    if (transport) newFilters.transport = transport as any;
    if (distance) newFilters.distance = parseInt(distance);

    if (Object.keys(newFilters).length > 0) {
      updateFilters(newFilters);
    }

    // Mettre à jour la position
    if (lat && lng) {
      const coordinates: [number, number] = [parseFloat(lng), parseFloat(lat)];
      setUserLocation(coordinates);
    }

    // Auto-recherche si demandée
    if (autoSearch === 'true' && query) {
      setTimeout(() => {
        performSearch(query);
      }, 1000);
    }
  }, [location.pathname, location.search]);

  // Obtenir les paramètres actuels depuis l'URL
  const getCurrentUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    return {
      category: urlParams.get('category'),
      query: urlParams.get('query'),
      transport: urlParams.get('transport'),
      distance: urlParams.get('distance'),
      lat: urlParams.get('lat'),
      lng: urlParams.get('lng'),
      autoSearch: urlParams.get('autoSearch')
    };
  }, [location.search]);

  return {
    // Navigation
    navigateToGeoSearch,
    navigateToCategories,
    
    // État actuel
    currentFilters: filters,
    currentLocation: userLocation,
    currentUrlParams: getCurrentUrlParams(),
    
    // Actions
    updateFilters,
    setUserLocation,
    performSearch
  };
};