
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { useSearchParams } from 'react-router-dom';

export const useAppInitialization = () => {
  const { 
    isInitialized, 
    initializeApp, 
    updateFilters,
    performSearch
  } = useAppStore();
  
  const [searchParams] = useSearchParams();

  // Initialisation de l'application
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  // Synchronisation avec les paramètres URL
  useEffect(() => {
    if (!isInitialized) return;

    const urlFilters = {
      category: searchParams.get('category'),
      subcategory: searchParams.get('subcategory'),
      transport: searchParams.get('transport') as any || 'walking',
      distance: Number(searchParams.get('distance')) || 10,
      unit: (searchParams.get('unit') as 'km' | 'mi') || 'km',
      query: searchParams.get('query') || '',
      aroundMeCount: Number(searchParams.get('aroundMeCount')) || 3,
      showMultiDirections: searchParams.get('showMultiDirections') === 'true',
      maxDuration: Number(searchParams.get('maxDuration')) || 20
    };

    // Mettre à jour les filtres si des paramètres URL sont présents
    const hasUrlParams = Object.values(urlFilters).some(value => 
      value !== null && value !== '' && value !== 0
    );

    if (hasUrlParams) {
      updateFilters(urlFilters);
      // Déclencher une recherche après un court délai
      setTimeout(() => performSearch(), 1000);
    }
  }, [searchParams, isInitialized, updateFilters, performSearch]);

  return { isInitialized };
};
