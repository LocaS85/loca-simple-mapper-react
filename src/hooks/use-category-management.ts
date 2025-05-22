
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { convertCategories } from '@/utils/categoryConverter';
import { fullCategoriesData } from '../data/fullCategories';
import { Category } from '@/types';
import { TransportMode } from '@/lib/data/transportModes';

export interface CategoryFilters {
  category?: string;
  transportMode: TransportMode;
  maxDistance: number;
  maxDuration: number;
  aroundMeCount: number;
  showMultiDirections: boolean;
  distanceUnit: 'km' | 'mi';
}

export function useCategoryManagement() {
  const [convertedCategories, setConvertedCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transportMode, setTransportMode] = useState<TransportMode>("walking");
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxDuration, setMaxDuration] = useState(20);
  const [aroundMeCount, setAroundMeCount] = useState(3);
  const [showMultiDirections, setShowMultiDirections] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  
  const { toast } = useToast();
  
  // Load and convert categories on initial render
  useEffect(() => {
    try {
      setIsLoading(true);
      setConvertedCategories(convertCategories(fullCategoriesData));
    } catch (error) {
      console.error("Erreur lors de la conversion des catégories:", error);
      toast({
        title: "Erreur de données",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleFiltersChange = (filters: Partial<CategoryFilters>) => {
    if (filters.transportMode !== undefined) {
      setTransportMode(filters.transportMode);
    }
    
    if (filters.maxDistance !== undefined) {
      setMaxDistance(filters.maxDistance);
    }
    
    if (filters.maxDuration !== undefined) {
      setMaxDuration(filters.maxDuration);
    }
    
    if (filters.aroundMeCount !== undefined) {
      setAroundMeCount(filters.aroundMeCount);
    }
    
    if (filters.showMultiDirections !== undefined) {
      setShowMultiDirections(filters.showMultiDirections);
    }
    
    if (filters.distanceUnit !== undefined) {
      setDistanceUnit(filters.distanceUnit);
    }
    
    // Find category by ID if needed
    if (filters.category && (!selectedCategory || selectedCategory.id !== filters.category)) {
      const category = convertedCategories.find(c => c.id === filters.category);
      if (category) {
        setSelectedCategory(category);
      }
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };
  
  // Fonction pour obtenir tous les filtres actuels
  const getCurrentFilters = (): CategoryFilters => {
    return {
      category: selectedCategory?.id,
      transportMode,
      maxDistance,
      maxDuration,
      aroundMeCount,
      showMultiDirections,
      distanceUnit
    };
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setTransportMode("walking");
    setMaxDistance(5);
    setMaxDuration(20);
    setAroundMeCount(3);
    setShowMultiDirections(false);
    setDistanceUnit('km');
  };

  return {
    convertedCategories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
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
    handleFiltersChange,
    handleSelectCategory,
    getCurrentFilters,
    resetFilters
  };
}
