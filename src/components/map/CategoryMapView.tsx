
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapRef } from 'react-map-gl';
import { FilterBar } from '@/components/FilterBar';
import { TransportMode } from '@/lib/data/transportModes';
import { useToast } from '@/hooks/use-toast';

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
  const mapRef = useRef<MapRef | null>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    category: 'food',
    transportMode: 'car' as TransportMode,
    maxDistance: 5,
    maxDuration: 15
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris par défaut
      zoom: 12
    });

    initMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    setMap(initMap);
    
    // Create a more complete adapter for MapRef
    // We need to cast as any to avoid TypeScript errors
    // because mapboxgl.Map doesn't exactly match the React-map-gl Map interface
    mapRef.current = initMap as any;

    return () => {
      initMap.remove();
      setMap(null);
      mapRef.current = null;
    };
  }, []);

  const handleFiltersChange = (newFilters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    
    // Here you can apply filters to the map
    // For example, you might want to update markers or change the view
    if (map) {
      // Apply filters logic here
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
      <div className="h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </>
  );
};

export default CategoryMapView;
