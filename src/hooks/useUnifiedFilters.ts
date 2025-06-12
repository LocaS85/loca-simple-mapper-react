
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TransportMode, DistanceUnit } from '@/types/map';
import { useTranslation } from 'react-i18next';
import { trackFilterChange, trackSearchEvent } from '@/services/analytics';

export interface UnifiedFilters {
  category: string | null;
  subcategory: string | null;
  transport: TransportMode;
  distance: number;
  unit: DistanceUnit;
  query: string;
  aroundMeCount: number;
  showMultiDirections: boolean;
  maxDuration: number;
}

export interface UnifiedFiltersHook {
  filters: UnifiedFilters;
  updateFilter: <K extends keyof UnifiedFilters>(key: K, value: UnifiedFilters[K]) => void;
  updateFilters: (newFilters: Partial<UnifiedFilters>) => void;
  resetFilters: () => void;
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultFilters: UnifiedFilters = {
  category: null,
  subcategory: null,
  transport: 'walking',
  distance: 10,
  unit: 'km',
  query: '',
  aroundMeCount: 3,
  showMultiDirections: false,
  maxDuration: 20
};

export const useUnifiedFilters = (): UnifiedFiltersHook => {
  const [filters, setFilters] = useState<UnifiedFilters>(defaultFilters);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Initialiser la géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setUserLocation([2.3522, 48.8566]); // Paris par défaut
          toast({
            title: "Position par défaut",
            description: "Utilisation de Paris comme position par défaut",
            variant: "default",
          });
        }
      );
    }
  }, [toast]);

  const updateFilter = useCallback(<K extends keyof UnifiedFilters>(
    key: K, 
    value: UnifiedFilters[K]
  ) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Analytics pour changements de filtres
      trackFilterChange(key, value);
      
      return newFilters;
    });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<UnifiedFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Analytics pour changements multiples
      Object.entries(newFilters).forEach(([key, value]) => {
        trackFilterChange(key, value);
      });
      
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    const resetData = { ...defaultFilters };
    if (filters.query) {
      resetData.query = filters.query; // Garder la requête
    }
    
    setFilters(resetData);
    
    toast({
      title: t("filters.reset"),
      description: t("filters.resetSuccess"),
    });
  }, [filters.query, toast, t]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    userLocation,
    setUserLocation,
    showFilters,
    toggleFilters,
    isLoading,
    setIsLoading
  };
};
