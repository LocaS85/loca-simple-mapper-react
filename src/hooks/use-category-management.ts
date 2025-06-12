
import { useState, useCallback } from 'react';
import { TransportMode } from '@/types/map';

export const useCategoryManagement = () => {
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState<[number, number]>([2.3522, 48.8566]);
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [maxDistance, setMaxDistance] = useState(10);
  const [maxDuration, setMaxDuration] = useState(60);
  const [aroundMeCount, setAroundMeCount] = useState(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [showMultiDirections, setShowMultiDirections] = useState(false);

  const updateMapZoom = useCallback((zoom: number) => {
    setMapZoom(zoom);
  }, []);

  const updateMapCenter = useCallback((center: [number, number]) => {
    setMapCenter(center);
  }, []);

  const categories = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: '#e67e22' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#f39c12' },
    { id: 'health', name: 'Santé', icon: '🏥', color: '#27ae60' }
  ];

  const selectedCategory = categories[0];

  const selectCategory = useCallback((categoryId: string) => {
    console.log('Sélection de la catégorie:', categoryId);
  }, []);

  const clearSelection = useCallback(() => {
    console.log('Effacer la sélection');
  }, []);

  const handleFiltersChange = useCallback((newFilters: any) => {
    console.log('Changement de filtres:', newFilters);
  }, []);

  const handleSelectCategory = useCallback((categoryId: string) => {
    selectCategory(categoryId);
  }, [selectCategory]);

  const resetFilters = useCallback(() => {
    setTransportMode('car');
    setMaxDistance(10);
    setMaxDuration(60);
    setAroundMeCount(5);
    setDistanceUnit('km');
    setShowMultiDirections(false);
  }, []);

  return {
    mapZoom,
    setMapZoom: updateMapZoom,
    mapCenter,
    setMapCenter: updateMapCenter,
    categories,
    selectedCategory,
    selectCategory,
    clearSelection,
    convertedCategories: categories,
    isLoading: false,
    transportMode,
    setTransportMode,
    maxDistance,
    setMaxDistance,
    maxDuration,
    setMaxDuration,
    aroundMeCount,
    setAroundMeCount,
    distanceUnit,
    setDistanceUnit,
    showMultiDirections,
    setShowMultiDirections,
    handleFiltersChange,
    handleSelectCategory,
    resetFilters
  };
};
