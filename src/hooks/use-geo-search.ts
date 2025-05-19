import { useState, useCallback, useEffect } from 'react';
import { TransportMode } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Keep URL params in sync with filters
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (filters.category) newParams.set('category', filters.category);
    else newParams.delete('category');
    
    if (filters.subcategory) newParams.set('subcategory', filters.subcategory);
    else newParams.delete('subcategory');
    
    newParams.set('transport', filters.transport);
    newParams.set('distance', filters.distance.toString());
    newParams.set('unit', filters.unit);
    
    if (filters.query) newParams.set('query', filters.query);
    else newParams.delete('query');
    
    setSearchParams(newParams, { replace: true });
  }, [filters, setSearchParams]);

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
      console.log('Loading results with filters:', filters);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on the filters
      const mockResults: SearchResult[] = [
        { 
          id: '1', 
          name: `${filters.category || 'Lieu'} ${filters.subcategory || 'populaire'} 1`, 
          address: '123 Rue de Paris, Paris',
          coordinates: [2.34, 48.86], 
          type: filters.subcategory || 'default',
          category: filters.category || 'default', 
          distance: Math.round(Math.random() * filters.distance * 10) / 10, 
          duration: Math.round(Math.random() * 30) 
        },
        { 
          id: '2', 
          name: `${filters.category || 'Lieu'} ${filters.subcategory || 'populaire'} 2`, 
          address: '45 Avenue des Champs-Élysées, Paris',
          coordinates: [2.37, 48.87], 
          type: filters.subcategory || 'default',
          category: filters.category || 'default', 
          distance: Math.round(Math.random() * filters.distance * 10) / 10, 
          duration: Math.round(Math.random() * 30) 
        },
        { 
          id: '3', 
          name: `${filters.category || 'Lieu'} ${filters.subcategory || 'populaire'} 3`, 
          address: '78 Boulevard Saint-Michel, Paris',
          coordinates: [2.29, 48.86], 
          type: filters.subcategory || 'default',
          category: filters.category || 'default', 
          distance: Math.round(Math.random() * filters.distance * 10) / 10, 
          duration: Math.round(Math.random() * 30) 
        }
      ];
      
      setResults(mockResults);
      
      if (mockResults.length > 0) {
        toast({
          title: "Résultats trouvés",
          description: `${mockResults.length} lieux trouvés pour votre recherche`,
        });
      } else {
        toast({
          title: "Aucun résultat",
          description: "Essayez de modifier vos filtres de recherche",
          variant: "destructive",
        });
      }
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

  // Load results when filters change
  useEffect(() => {
    loadResults();
  }, [loadResults]);

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
