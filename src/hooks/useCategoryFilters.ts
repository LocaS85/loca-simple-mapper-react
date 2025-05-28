
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TransportMode } from '@/lib/data/transportModes';
import { Category } from '@/types';
import { useFilteredSearch } from './useMapboxFilters';
import { FilterSearchParams } from '@/services/mapboxFilterService';

export interface CategoryFiltersHook {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
  aroundMeCount: number;
  setAroundMeCount: (count: number) => void;
  showMultiDirections: boolean;
  setShowMultiDirections: (show: boolean) => void;
  distanceUnit: 'km' | 'mi';
  setDistanceUnit: (unit: 'km' | 'mi') => void;
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  results: any[];
  isLoading: boolean;
  searchWithFilters: () => void;
  resetFilters: () => void;
}

export const useCategoryFilters = (): CategoryFiltersHook => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxDuration, setMaxDuration] = useState(20);
  const [aroundMeCount, setAroundMeCount] = useState(3);
  const [showMultiDirections, setShowMultiDirections] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [shouldSearch, setShouldSearch] = useState(false);
  
  const { toast } = useToast();

  // Préparer les paramètres de recherche
  const searchParams: FilterSearchParams = {
    category: selectedCategory?.id || undefined,
    center: userLocation || [2.3522, 48.8566],
    radius: maxDistance,
    unit: distanceUnit,
    transportMode,
    maxDuration,
    limit: aroundMeCount
  };

  // Utiliser le hook de recherche filtrée
  const { data: results = [], isLoading, refetch } = useFilteredSearch(
    searchParams,
    shouldSearch && !!userLocation
  );

  // Obtenir la localisation utilisateur au démarrage
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
            variant: "destructive"
          });
          setUserLocation([2.3522, 48.8566]); // Paris par défaut
        }
      );
    }
  }, [toast]);

  // Fonction pour déclencher une recherche
  const searchWithFilters = useCallback(() => {
    if (userLocation) {
      setShouldSearch(true);
      refetch();
    }
  }, [userLocation, refetch]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setTransportMode('walking');
    setMaxDistance(5);
    setMaxDuration(20);
    setAroundMeCount(3);
    setShowMultiDirections(false);
    setDistanceUnit('km');
    setShouldSearch(false);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été remis à zéro",
    });
  }, [toast]);

  return {
    selectedCategory,
    setSelectedCategory,
    transportMode,
    setTransportMode,
    maxDistance,
    setMaxDistance,
    maxDuration,
    setMaxDuration,
    aroundMeCount,
    setAroundMeCount,
    showMultiDirections,
    setShowMultiDirections,
    distanceUnit,
    setDistanceUnit,
    userLocation,
    setUserLocation,
    results,
    isLoading,
    searchWithFilters,
    resetFilters
  };
};
