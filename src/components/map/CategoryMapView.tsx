
import React, { useState, useEffect } from 'react';
import MapboxMap from '../MapboxMap';
import { SearchResult } from '@/types/geosearch';
import { TransportMode, DistanceUnit } from '@/types/map';
import { useToast } from '@/hooks/use-toast';

interface CategoryMapViewProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  userLocation?: [number, number];
  transport?: TransportMode;
  radius?: number;
  count?: number;
  unit?: DistanceUnit;
  onResultsChange?: (results: SearchResult[]) => void;
  className?: string;
}

export default function CategoryMapView({
  selectedCategory = '',
  selectedSubcategory = '',
  userLocation,
  transport = 'walking',
  radius = 10,
  count = 5,
  unit = 'km',
  onResultsChange,
  className = ''
}: CategoryMapViewProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && selectedCategory) {
      searchPlaces();
    }
  }, [userLocation, selectedCategory, selectedSubcategory, transport, radius]);

  const searchPlaces = async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      // Simulation de recherche de lieux
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: `${selectedCategory} 1`,
          address: 'Adresse exemple 1',
          coordinates: [userLocation[0] + 0.001, userLocation[1] + 0.001],
          type: selectedCategory,
          category: selectedCategory,
          distance: 0.2,
          duration: 3
        },
        {
          id: '2',
          name: `${selectedCategory} 2`,
          address: 'Adresse exemple 2',
          coordinates: [userLocation[0] - 0.001, userLocation[1] + 0.002],
          type: selectedCategory,
          category: selectedCategory,
          distance: 0.5,
          duration: 7
        }
      ];

      setResults(mockResults);
      onResultsChange?.(mockResults);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de rechercher les lieux",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <MapboxMap
        results={results}
        transport={transport}
        radius={radius}
        category={selectedCategory}
        className="w-full h-full"
      />
      
      {isLoading && (
        <div className="absolute top-4 left-4 bg-white rounded-md shadow-md px-3 py-2">
          <span className="text-sm text-gray-600">Recherche en cours...</span>
        </div>
      )}
    </div>
  );
}
