
import { useState, useCallback } from 'react';
import { Place, TransportMode } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface GeoSearchFilters {
  query?: string;
  category?: string | null;
  subcategory?: string | null;
  transport: TransportMode;
  distance: number;
  unit: 'km' | 'mi';
}

interface UseGeoSearchProps {
  category?: string | null;
  subcategory?: string | null;
  transport?: string;
  distance?: number;
  unit?: string;
}

export const useGeoSearch = ({
  category: initialCategory,
  subcategory: initialSubcategory,
  transport: initialTransport = 'car',
  distance: initialDistance = 10,
  unit: initialUnit = 'km'
}: UseGeoSearchProps) => {
  // State for filters
  const [filters, setFilters] = useState<GeoSearchFilters>({
    category: initialCategory || null,
    subcategory: initialSubcategory || null,
    transport: initialTransport as TransportMode,
    distance: initialDistance || 10,
    unit: (initialUnit || 'km') as 'km' | 'mi',
    query: ''
  });

  // State for search results
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Toggle filters popup
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<GeoSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Load results
  const loadResults = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Mock data for now - would be replaced with actual API call
      console.log('Loading results with filters:', filters);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data that respects the filters
      const mockResults: Place[] = [
        { 
          id: '1', 
          name: 'Café Parisien', 
          address: '123 Rue de Paris, Paris',
          coordinates: [2.34, 48.86], 
          type: 'Restaurant',
          category: filters.category || 'food', 
          distance: 1.2, 
          duration: 15 
        },
        { 
          id: '2', 
          name: 'Pharmacie Centrale', 
          address: '45 Avenue des Champs-Élysées, Paris',
          coordinates: [2.37, 48.87], 
          type: 'Pharmacie',
          category: 'health', 
          distance: 2.1, 
          duration: 20 
        },
        { 
          id: '3', 
          name: 'Supermarché Bio', 
          address: '78 Boulevard Saint-Michel, Paris',
          coordinates: [2.29, 48.86], 
          type: 'Supermarché',
          category: 'shopping', 
          distance: 3.5, 
          duration: 35 
        }
      ];
      
      setResults(mockResults);
    } catch (error) {
      console.error('Error loading results:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les résultats',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  return {
    results,
    loadResults,
    filters,
    updateFilters,
    isLoading,
    showFilters,
    toggleFilters
  };
};
