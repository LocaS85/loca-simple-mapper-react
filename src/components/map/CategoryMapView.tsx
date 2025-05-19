
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
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
    aroundMeRadius?: number;
    showMultiDirections?: boolean;
  }) => void;
  selectedCategory?: Category | null;
  initialTransportMode?: TransportMode;
  initialMaxDistance?: number; 
  initialMaxDuration?: number;
  initialAroundMeRadius?: number;
  initialShowMultiDirections?: boolean;
}

const CategoryMapView: React.FC<CategoryMapViewProps> = ({ 
  onFiltersChange,
  selectedCategory,
  initialTransportMode = 'car',
  initialMaxDistance = 5,
  initialMaxDuration = 15,
  initialAroundMeRadius = 5,
  initialShowMultiDirections = false
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null);

  const [filters, setFilters] = useState({
    category: selectedCategory?.id || 'food',
    transportMode: initialTransportMode,
    maxDistance: initialMaxDistance,
    maxDuration: initialMaxDuration,
    aroundMeRadius: initialAroundMeRadius,
    showMultiDirections: initialShowMultiDirections
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

  // Get user location
  useEffect(() => {
    if (filters.aroundMeRadius > 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          setUserLocation({ lng, lat });
          
          // Center map on user location if available
          if (map) {
            map.flyTo({
              center: [lng, lat],
              zoom: 13
            });
            
            // Add user location marker
            const el = document.createElement('div');
            el.className = 'user-marker';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = '#3b82f6';
            el.style.border = '2px solid white';
            
            new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .addTo(map);
              
            // Add radius circle
            if (map.getSource('radius')) {
              const source = map.getSource('radius') as mapboxgl.GeoJSONSource;
              source.setData({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [lng, lat]
                }
              });
            } else {
              map.addSource('radius', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                  }
                }
              });
              
              map.addLayer({
                id: 'radius-circle',
                type: 'circle',
                source: 'radius',
                paint: {
                  'circle-radius': ['interpolate', ['linear'], ['zoom'],
                    10, filters.aroundMeRadius * 1000 / (40075000 / 360 * Math.cos(lat * Math.PI / 180)),
                    15, filters.aroundMeRadius * 1000 / (40075000 / 360 * Math.cos(lat * Math.PI / 180) / 2)
                  ],
                  'circle-color': selectedCategory?.color || '#3b82f6',
                  'circle-opacity': 0.2,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': selectedCategory?.color || '#3b82f6',
                  'circle-stroke-opacity': 0.5
                }
              });
            }
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Localisation",
            description: "Impossible d'obtenir votre position actuelle",
            variant: "destructive"
          });
        }
      );
    }
  }, [filters.aroundMeRadius, map, selectedCategory?.color, toast]);

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

  // Draw multi-directional routes when enabled
  useEffect(() => {
    if (!map || !userLocation || !filters.showMultiDirections) return;
    
    // Sample POIs - in a real app, these would come from your data source
    const pois = [
      { name: "Point A", coordinates: [userLocation.lng + 0.01, userLocation.lat + 0.01] },
      { name: "Point B", coordinates: [userLocation.lng - 0.01, userLocation.lat + 0.01] },
      { name: "Point C", coordinates: [userLocation.lng + 0.01, userLocation.lat - 0.01] },
      { name: "Point D", coordinates: [userLocation.lng - 0.01, userLocation.lat - 0.01] },
    ];
    
    // Remove existing routes
    if (map.getSource('routes')) {
      map.removeLayer('routes-line');
      map.removeSource('routes');
    }
    
    // Add POI markers
    pois.forEach((poi, index) => {
      const el = document.createElement('div');
      el.className = `poi-marker-${index}`;
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#ef4444';
      el.style.border = '2px solid white';
      
      new mapboxgl.Marker(el)
        .setLngLat(poi.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
        .addTo(map);
    });
    
    // Create routes data
    // Note: In a real app, you'd use the Mapbox Directions API to get actual routes
    const routesData = {
      type: 'FeatureCollection',
      features: pois.map(poi => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [userLocation.lng, userLocation.lat],
            poi.coordinates
          ]
        }
      }))
    };
    
    // Add routes to map
    map.addSource('routes', {
      type: 'geojson',
      data: routesData as any
    });
    
    map.addLayer({
      id: 'routes-line',
      type: 'line',
      source: 'routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': selectedCategory?.color || '#3b82f6',
        'line-width': 3,
        'line-opacity': 0.8,
        'line-dasharray': [1, 1]
      }
    });
    
  }, [filters.showMultiDirections, map, userLocation, selectedCategory?.color]);

  const handleFiltersChange = (newFilters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
    aroundMeRadius?: number;
    showMultiDirections?: boolean;
  }) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    
    // Apply filters to the map if available
    if (map) {
      // If there's a selectedCategory, use its color for visual feedback
      const categoryColor = selectedCategory?.color || '#3b82f6';
      
      // Update radius circle if it exists and aroundMeRadius changed
      if (map.getSource('radius') && userLocation && newFilters.aroundMeRadius !== filters.aroundMeRadius) {
        // Update circle radius based on the new filter value
        map.setPaintProperty('radius-circle', 'circle-radius', 
          ['interpolate', ['linear'], ['zoom'],
            10, newFilters.aroundMeRadius * 1000 / (40075000 / 360 * Math.cos(userLocation.lat * Math.PI / 180)),
            15, newFilters.aroundMeRadius * 1000 / (40075000 / 360 * Math.cos(userLocation.lat * Math.PI / 180) / 2)
          ]
        );
      }
      
      // Provide visual feedback about applied filters
      toast({
        title: "Filtres appliqués",
        description: `Catégorie: ${newFilters.category}, Transport: ${newFilters.transportMode}, Distance: ${newFilters.maxDistance}km, Durée: ${newFilters.maxDuration}min${
          newFilters.aroundMeRadius ? `, Autour de moi: ${newFilters.aroundMeRadius}km` : ''
        }`
      });
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
          initialAroundMeRadius={initialAroundMeRadius}
          initialShowMultiDirections={initialShowMultiDirections}
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
