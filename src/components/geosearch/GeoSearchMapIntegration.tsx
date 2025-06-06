
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { CategoryMapView, EnhancedMapboxSearch, MultiRouteDisplay } from '@/components/map';
import { getMapboxToken } from '@/utils/mapboxConfig';
import { TransportMode } from '@/lib/data/transportModes';
import { useToast } from '@/hooks/use-toast';

interface GeoSearchMapIntegrationProps {
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
}

const GeoSearchMapIntegration: React.FC<GeoSearchMapIntegrationProps> = ({
  onLocationSelect
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  
  const {
    userLocation,
    filters,
    results,
    updateFilters
  } = useGeoSearchStore();

  // Initialiser la carte si nécessaire
  useEffect(() => {
    if (!mapRef.current && userLocation) {
      try {
        mapboxgl.accessToken = getMapboxToken();
        
        const newMap = new mapboxgl.Map({
          container: 'geo-map-container',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: userLocation,
          zoom: 13
        });

        newMap.on('load', () => {
          setMap(newMap);
          mapRef.current = newMap;
        });

      } catch (error) {
        console.error('❌ Erreur d\'initialisation de la carte:', error);
        toast({
          title: "Erreur de carte",
          description: "Impossible d'initialiser la carte intégrée",
          variant: "destructive",
        });
      }
    }
  }, [userLocation, toast]);

  const handleFiltersChange = (newFilters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
    aroundMeCount?: number;
    showMultiDirections?: boolean;
    distanceUnit?: 'km' | 'mi';
  }) => {
    // Convertir les filtres pour le store GeoSearch
    updateFilters({
      category: newFilters.category,
      transport: newFilters.transportMode,
      distance: newFilters.maxDistance,
      maxDuration: newFilters.maxDuration,
      aroundMeCount: newFilters.aroundMeCount || 3,
      showMultiDirections: newFilters.showMultiDirections || false,
      unit: newFilters.distanceUnit || 'km'
    });
  };

  const handleSearchResult = (result: {
    lng: number;
    lat: number;
    place_name: string;
    address?: string;
  }) => {
    if (onLocationSelect) {
      onLocationSelect({
        name: result.place_name.split(',')[0],
        coordinates: [result.lng, result.lat],
        placeName: result.place_name
      });
    }
  };

  // Convertir les résultats pour MultiRouteDisplay
  const destinations = results.map(result => ({
    id: result.id,
    coordinates: result.coordinates,
    name: result.name
  }));

  return (
    <div className="relative w-full h-full">
      <div id="geo-map-container" className="w-full h-full" />
      
      {/* Intégration de la recherche avancée */}
      {map && (
        <div className="absolute top-4 left-4 z-10">
          <EnhancedMapboxSearch
            mapRef={{ current: map }}
            onResult={handleSearchResult}
            proximity={userLocation || undefined}
            placeholder="Rechercher un lieu..."
            className="w-80"
          />
        </div>
      )}

      {/* Affichage des routes multiples si activé */}
      {map && userLocation && filters.showMultiDirections && destinations.length > 0 && (
        <MultiRouteDisplay
          map={map}
          origin={userLocation}
          destinations={destinations}
          transportMode={filters.transport}
          showLines={true}
          lineColor="#3B82F6"
        />
      )}

      {/* Vue catégorie intégrée (masquée mais connectée) */}
      <div className="hidden">
        <CategoryMapView
          onFiltersChange={handleFiltersChange}
          selectedCategory={filters.category ? { 
            id: filters.category, 
            name: filters.category,
            color: '#3B82F6'
          } : null}
          initialTransportMode={filters.transport}
          initialMaxDistance={filters.distance}
          initialMaxDuration={filters.maxDuration}
          initialAroundMeCount={filters.aroundMeCount}
          initialShowMultiDirections={filters.showMultiDirections}
          initialDistanceUnit={filters.unit}
        />
      </div>
    </div>
  );
};

export default GeoSearchMapIntegration;
