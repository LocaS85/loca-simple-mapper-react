
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { convertCategories } from '@/utils/categoryConverter';
import { fullCategoriesData } from '../data/fullCategories';
import { Category } from '@/types';
import { TransportMode } from '@/lib/data/transportModes';

export function useCategoryManagement() {
  const [convertedCategories, setConvertedCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transportMode, setTransportMode] = useState<TransportMode>("walking");
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxDuration, setMaxDuration] = useState(20);
  const [aroundMeCount, setAroundMeCount] = useState(3);
  const [showMultiDirections, setShowMultiDirections] = useState(false);
  
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

  const handleFiltersChange = (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
    aroundMeCount: number;
    showMultiDirections: boolean;
  }) => {
    setTransportMode(filters.transportMode);
    setMaxDistance(filters.maxDistance);
    setMaxDuration(filters.maxDuration);
    setAroundMeCount(filters.aroundMeCount);
    setShowMultiDirections(filters.showMultiDirections);
    
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

  return {
    convertedCategories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    transportMode,
    maxDistance,
    setMaxDistance,
    maxDuration,
    setMaxDuration,
    aroundMeCount,
    setAroundMeCount,
    showMultiDirections,
    setShowMultiDirections,
    handleFiltersChange,
    handleSelectCategory
  };
}
