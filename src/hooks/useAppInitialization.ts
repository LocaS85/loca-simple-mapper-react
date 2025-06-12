
import { useEffect, useState } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useSearchParams } from 'react-router-dom';
import { TransportMode, DistanceUnit } from '@/types/map';

export const useAppInitialization = () => {
  const { 
    isMapboxReady,
    initializeMapbox,
    updateFilters,
    performSearch
  } = useGeoSearchStore();
  
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  // Initialisation de Mapbox
  useEffect(() => {
    if (!isMapboxReady) {
      console.log('🚀 Initialisation de Mapbox depuis useAppInitialization...');
      initializeMapbox()
        .then(() => {
          setInitialized(true);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'initialisation:', error);
        });
    } else {
      setInitialized(true);
    }
  }, [isMapboxReady, initializeMapbox]);

  // Synchronisation avec les paramètres URL
  useEffect(() => {
    if (!initialized) return;

    const urlFilters = {
      category: searchParams.get('category'),
      subcategory: searchParams.get('subcategory'),
      transport: (searchParams.get('transport') as TransportMode) || 'walking',
      distance: Number(searchParams.get('distance')) || 10,
      unit: (searchParams.get('unit') as DistanceUnit) || 'km',
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
      console.log('📱 Mise à jour des filtres depuis URL:', urlFilters);
      updateFilters(urlFilters);
      
      // Déclencher une recherche après un court délai
      setTimeout(() => {
        console.log('🔍 Déclenchement de la recherche automatique depuis URL');
        performSearch();
      }, 1000);
    }
  }, [searchParams, initialized, updateFilters, performSearch]);

  return { 
    isInitialized: initialized,
    isMapboxReady 
  };
};
