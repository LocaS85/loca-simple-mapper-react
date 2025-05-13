
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapRef } from 'react-map-gl';
import { FilterBar } from '@/components/FilterBar';
import { TransportMode } from '@/lib/data/transportModes';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken } from '@/utils/mapboxConfig';

interface CategoryMapViewProps {
  onFiltersChange?: (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => void;
}

const CategoryMapView: React.FC<CategoryMapViewProps> = ({ onFiltersChange }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    category: 'food',
    transportMode: 'car' as TransportMode,
    maxDistance: 5,
    maxDuration: 15
  });

  // Initialize map with error handling
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const token = getMapboxToken();
      
      if (!token) {
        console.error('Mapbox token not found');
        toast({
          title: "Erreur de carte",
          description: "Token Mapbox non trouvé. Veuillez configurer votre token Mapbox.",
          variant: "destructive"
        });
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
      });

      initMap.on('error', (e) => {
        console.error('Map error:', e);
        toast({
          title: "Erreur de carte",
          description: "Une erreur est survenue lors du chargement de la carte",
          variant: "destructive"
        });
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
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte Mapbox",
        variant: "destructive"
      });
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
      toast({
        title: "Filtres appliqués",
        description: `Catégorie: ${newFilters.category}, Transport: ${newFilters.transportMode}, Distance: ${newFilters.maxDistance}km, Durée: ${newFilters.maxDuration}min`
      });
    }
    
    // Call parent handler if provided
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <>
      {/* Filter Bar for Map View */}
      <div className="mb-4">
        <FilterBar 
          mapRef={mapRef} 
          onFiltersChange={handleFiltersChange} 
        />
      </div>
      <div className="h-[70vh] bg-gray-100 rounded-lg overflow-hidden relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        {!map && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Chargement de la carte...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryMapView;
