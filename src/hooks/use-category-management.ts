
import { useState, useCallback } from 'react';

export const useCategoryManagement = () => {
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState<[number, number]>([2.3522, 48.8566]); // Paris par défaut

  const updateMapZoom = useCallback((zoom: number) => {
    setMapZoom(zoom);
  }, []);

  const updateMapCenter = useCallback((center: [number, number]) => {
    setMapCenter(center);
  }, []);

  // Mock data pour les catégories
  const categories = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Santé', icon: '🏥' }
  ];

  const selectedCategory = categories[0];

  const selectCategory = useCallback((categoryId: string) => {
    console.log('Sélection de la catégorie:', categoryId);
  }, []);

  const clearSelection = useCallback(() => {
    console.log('Effacer la sélection');
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
    // Propriétés manquantes ajoutées avec des valeurs par défaut
    convertedCategories: categories,
    isLoading: false,
    transportMode: 'car' as const,
    maxDistance: 10,
    setMaxDistance: (distance: number) => console.log('Distance:', distance),
    maxDuration: 60,
    setMaxDuration: (duration: number) => console.log('Durée:', duration),
    aroundMeCount: 5,
    setAroundMeCount: (count: number) => console.log('Nombre:', count),
    distanceUnit: 'km' as const,
    setDistanceUnit: (unit: 'km' | 'miles') => console.log('Unité:', unit)
  };
};
