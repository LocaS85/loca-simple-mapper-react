
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
      console.log('Initialisation de l\'application...');
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
    const hasUrlParams = Object.entries(urlFilters).some(([key, value]) => {
      if (key === 'transport' && value === 'walking') return false;
      if (key === 'distance' && value === 10) return false;
      if (key === 'unit' && value === 'km') return false;
      if (key === 'aroundMeCount' && value === 3) return false;
      if (key === 'maxDuration' && value === 20) return false;
      return value !== null && value !== '';
    });

    if (hasUrlParams) {
      console.log('Mise à jour des filtres depuis URL:', urlFilters);
      updateFilters(urlFilters);
      // Déclencher une recherche après un court délai
      setTimeout(() => {
        console.log('Déclenchement de la recherche automatique');
        performSearch();
      }, 1000);
    }
  }, [searchParams, isInitialized, updateFilters, performSearch]);

  return { isInitialized };
};
