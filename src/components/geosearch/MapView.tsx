
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { mapboxApiService } from '@/services/mapboxApiService';
import MapMarkers from './map/MapMarkers';
import MapLegend from './map/MapLegend';
import MapStatusIndicator from './map/MapStatusIndicator';

interface MapViewProps {
  transport?: TransportMode;
}

const MapView: React.FC<MapViewProps> = ({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hasRouteLayer, setHasRouteLayer] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const {
    userLocation,
    results,
    isLoading,
    isMapboxReady,
    mapboxError
  } = useGeoSearchStore();

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !isMapboxReady) return;
    
    try {
      if (!isMapboxTokenValid()) {
        setMapError('Token Mapbox invalide');
        return;
      }

      const mapboxToken = getMapboxToken();
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || [2.35, 48.85],
        zoom: isMobile ? 10 : 12
      });
      
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        
        // Ajouter source et layer pour les itinéraires
        newMap.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        newMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
        
        setHasRouteLayer(true);
      });
      
      newMap.on('error', (e) => {
        console.error('❌ Erreur de carte:', e);
        setMapError('Erreur de chargement de la carte');
      });
      
      map.current = newMap;
      
      return () => {
        map.current?.remove();
        map.current = null;
        setMapLoaded(false);
        setHasRouteLayer(false);
      };
    } catch (error) {
      console.error('❌ Erreur d\'initialisation de la carte:', error);
      setMapError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }, [isMobile, userLocation, isMapboxReady]);

  // Ajuster la carte aux résultats
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(userLocation);
      
      if (results.length > 0) {
        results.forEach(place => {
          bounds.extend(place.coordinates);
        });
        
        map.current.fitBounds(bounds, {
          padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
          maxZoom: isMobile ? 13 : 15
        });
      } else {
        map.current.setCenter(userLocation);
        map.current.setZoom(isMobile ? 10 : 12);
      }
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
    }
  }, [results, mapLoaded, userLocation, isMobile]);

  const handleRouteRequest = async (placeId: string) => {
    const targetPlace = results.find(p => p.id === placeId);
    if (!targetPlace || !userLocation || !map.current) return;
    
    try {
      const directions = await mapboxApiService.getDirections(
        userLocation,
        targetPlace.coordinates,
        transport || 'walking'
      );
      
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {
            name: `Route vers ${targetPlace.name}`,
            distance: directions.distance,
            duration: directions.duration
          },
          geometry: directions.geometry
        });
        
        toast({
          title: "Itinéraire calculé",
          description: `Distance: ${Math.round(directions.distance / 1000 * 10) / 10} km, Durée: ${Math.round(directions.duration / 60)} min`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('❌ Error calculating route:', error);
      toast({
        title: "Erreur d'itinéraire",
        description: "Impossible de calculer l'itinéraire",
        variant: "destructive",
      });
    }
  };

  if (mapboxError || !isMapboxReady || mapError) {
    return (
      <div className="w-full h-full pt-24 pb-16 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Problème de configuration Mapbox
          </h3>
          <p className="text-gray-600 mb-4">
            {mapError || mapboxError || 'Token Mapbox requis'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pt-24 pb-16">
      <div ref={mapContainer} className="relative w-full h-full">
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-2 text-sm text-gray-600">
                {!mapLoaded ? 'Chargement de la carte...' : 'Recherche en cours...'}
              </p>
            </div>
          </div>
        )}
        
        {mapLoaded && map.current && (
          <>
            <MapMarkers
              map={map.current}
              userLocation={userLocation}
              results={results}
              onRouteRequest={handleRouteRequest}
            />
            
            <MapStatusIndicator 
              resultsCount={results.length} 
              isLoading={isLoading} 
            />
            
            {userLocation && (
              <MapLegend hasRouteLayer={hasRouteLayer} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapView;
