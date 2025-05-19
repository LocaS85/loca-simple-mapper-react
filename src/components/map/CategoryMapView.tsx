
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// CSS is now loaded via CDN in index.html
import { FilterBar } from '@/components/FilterBar';
import { TransportMode } from '@/lib/data/transportModes';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { Category } from '@/types';

interface CategoryMapViewProps {
  onFiltersChange?: (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => void;
  selectedCategory?: Category | null;
  initialTransportMode?: TransportMode;
  initialMaxDistance?: number; 
  initialMaxDuration?: number;
}

const CategoryMapView: React.FC<CategoryMapViewProps> = ({ 
  onFiltersChange,
  selectedCategory,
  initialTransportMode = 'car',
  initialMaxDistance = 5,
  initialMaxDuration = 15
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    category: selectedCategory?.id || 'food',
    transportMode: initialTransportMode,
    maxDistance: initialMaxDistance,
    maxDuration: initialMaxDuration
  });

  // Update filters when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setFilters(prev => ({
        ...prev,
        category: selectedCategory.id
      }));
    }
  }, [selectedCategory]);

  // Initialize map with error handling
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const token = getMapboxToken();
      setIsLoading(true);
      
      if (!token) {
        console.error('Mapbox token not found');
        setError('Token Mapbox manquant');
        toast({
          title: "Erreur de carte",
          description: "Token Mapbox non trouvé. Veuillez configurer votre token Mapbox.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      mapboxgl.accessToken = token;
      
      const initMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [2.3522, 48.8566], // Paris par défaut
        zoom: 12
      });

      initMap.on('load', () => {
        console.log('Map loaded successfully');
        setIsLoading(false);
      });

      initMap.on('error', (e) => {
        console.error('Map error:', e);
        setError('Erreur de chargement de la carte');
        toast({
          title: "Erreur de carte",
          description: "Une erreur est survenue lors du chargement de la carte",
          variant: "destructive"
        });
        setIsLoading(false);
      });

      initMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      setMap(initMap);
      
      // Créer un adaptateur compatible avec MapRef
      mapRef.current = {
        getMap: () => initMap
      };

      return () => {
        initMap.remove();
        setMap(null);
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Erreur d\'initialisation de la carte');
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte Mapbox",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [toast]);

  const handleFiltersChange = (newFilters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    
    // Apply filters to the map if available
    if (map) {
      // If there's a selectedCategory, use its color for visual feedback
      const categoryColor = selectedCategory?.color || '#3b82f6';
      
      // Provide visual feedback about applied filters
      toast({
        title: "Filtres appliqués",
        description: `Catégorie: ${newFilters.category}, Transport: ${newFilters.transportMode}, Distance: ${newFilters.maxDistance}km, Durée: ${newFilters.maxDuration}min`
      });

      // Add any additional map-specific filter application here
      // For example, updating the map radius, markers, etc.
    }
    
    // Call parent handler if provided
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filter Bar for Map View */}
      <div className="mb-4">
        <FilterBar 
          mapRef={mapRef} 
          onFiltersChange={handleFiltersChange} 
          initialCategory={selectedCategory?.id}
          initialTransportMode={initialTransportMode}
          initialMaxDistance={initialMaxDistance}
          initialMaxDuration={initialMaxDuration}
        />
      </div>
      
      <div className="h-[70vh] bg-gray-100 rounded-lg overflow-hidden relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Chargement de la carte...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 z-10">
            <div className="text-center bg-white p-4 rounded-lg shadow-md max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-semibold text-red-700">{error}</p>
              <p className="text-gray-600 mt-2">Veuillez vérifier votre token Mapbox ou réessayer plus tard.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMapView;
