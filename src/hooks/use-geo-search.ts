import { useState, useCallback, useEffect } from 'react';
import { TransportMode } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UseGeoSearchProps {
  category?: string | null;
  subcategory?: string | null;
  transport?: string;
  distance?: number;
  unit?: string;
  query?: string | null;
  aroundMeCount?: number;
  showMultiDirections?: boolean;
}

export const useGeoSearch = ({
  category: initialCategory,
  subcategory: initialSubcategory,
  transport: initialTransport = 'car',
  distance: initialDistance = 10,
  unit: initialUnit = 'km',
  query: initialQuery = '',
  aroundMeCount: initialAroundMeCount = 3,
  showMultiDirections: initialShowMultiDirections = false
}: UseGeoSearchProps) => {
  const { t } = useTranslation();
  
  // State for filters
  const [filters, setFilters] = useState<GeoSearchFilters & {
    aroundMeCount?: number;
    showMultiDirections?: boolean;
  }>({
    category: initialCategory || null,
    subcategory: initialSubcategory || null,
    transport: initialTransport as TransportMode,
    distance: initialDistance || 10,
    unit: (initialUnit || 'km') as 'km' | 'mi',
    query: initialQuery || '',
    aroundMeCount: initialAroundMeCount || 3,
    showMultiDirections: initialShowMultiDirections || false
  });

  // State for search results
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: t("geosearch.locationError"),
            description: t("geosearch.locationErrorDesc"),
            variant: "destructive",
          });
          // Paris par défaut
          setUserLocation([2.35, 48.85]);
        }
      );
    }
  }, [toast, t]);

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
    
    if (filters.aroundMeCount) newParams.set('aroundMeCount', filters.aroundMeCount.toString());
    if (filters.showMultiDirections) newParams.set('showMultiDirections', filters.showMultiDirections.toString());
    
    setSearchParams(newParams, { replace: true });
  }, [filters, setSearchParams]);

  // Synchronize filters when URL params change
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const transport = searchParams.get('transport');
    const distance = searchParams.get('distance');
    const unit = searchParams.get('unit');
    const query = searchParams.get('query');
    const aroundMeCount = searchParams.get('aroundMeCount');
    const showMultiDirections = searchParams.get('showMultiDirections');
    
    const newFilters: Partial<typeof filters> = {};
    if (category !== null && category !== filters.category) newFilters.category = category;
    if (subcategory !== null && subcategory !== filters.subcategory) newFilters.subcategory = subcategory;
    if (transport && transport !== filters.transport) newFilters.transport = transport as TransportMode;
    if (distance && Number(distance) !== filters.distance) newFilters.distance = Number(distance);
    if (unit && unit !== filters.unit) newFilters.unit = unit as 'km' | 'mi';
    if (query !== null && query !== filters.query) newFilters.query = query;
    if (aroundMeCount && Number(aroundMeCount) !== filters.aroundMeCount) 
      newFilters.aroundMeCount = Number(aroundMeCount);
    if (showMultiDirections !== null && String(showMultiDirections) !== String(filters.showMultiDirections)) 
      newFilters.showMultiDirections = showMultiDirections === 'true';
    
    if (Object.keys(newFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  }, [searchParams, filters]);

  // Toggle filters popup
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<GeoSearchFilters & {
    aroundMeCount?: number;
    showMultiDirections?: boolean;
  }>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Load results
  const loadResults = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    
    try {
      console.log('Loading results with filters:', filters);
      console.log('User location:', userLocation);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate number of results based on aroundMeCount filter
      const resultCount = filters.aroundMeCount || 3;
      
      // Mock data based on the filters
      const mockResults: SearchResult[] = Array.from({ length: resultCount }, (_, i) => ({
        id: `result-${i}`, 
        name: `${filters.category || t('geosearch.place')} ${filters.subcategory || t('geosearch.popular')} ${i + 1}`, 
        address: `${123 + i} ${t('geosearch.streetName')}, ${filters.query || 'Paris'}`,
        coordinates: [
          userLocation[0] + (Math.random() * 0.02 - 0.01), 
          userLocation[1] + (Math.random() * 0.02 - 0.01)
        ] as [number, number], 
        type: filters.subcategory || 'default',
        category: filters.category || 'default', 
        distance: Math.round(Math.random() * filters.distance * 10) / 10, 
        duration: Math.round(Math.random() * 30) 
      }));
      
      // Si une requête de recherche est spécifiée, ajouter un résultat spécifique
      if (filters.query) {
        // Simulate search-specific results with correctly typed coordinates
        const searchSpecificResult: SearchResult = { 
          id: 'search-result',
          name: filters.query,
          address: `${t('geosearch.near')} ${filters.query}, ${t('geosearch.country')}`,
          coordinates: [userLocation[0] + 0.02, userLocation[1] + 0.02] as [number, number],
          type: 'search-result',
          category: filters.category || 'search',
          distance: Math.round(Math.random() * filters.distance * 10) / 10,
          duration: Math.round(Math.random() * 30)
        };
        
        mockResults.unshift(searchSpecificResult);
      }
      
      setResults(mockResults.slice(0, resultCount));
      
      // Only show toast when results are actually loaded (not on initial load)
      if (filters.category || filters.subcategory || filters.query) {
        toast({
          title: t("geosearch.resultsFound"),
          description: t("geosearch.placesFoundForSearch", { count: mockResults.length }),
        });
      }
    } catch (error) {
      console.error('Error loading results:', error);
      toast({
        title: t('geosearch.error'),
        description: t('geosearch.errorLoadingResults'),
        variant: 'destructive',
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast, userLocation, t]);

  return {
    results,
    loadResults,
    filters,
    updateFilters,
    isLoading,
    showFilters,
    toggleFilters,
    userLocation,
    setUserLocation
  };
};
