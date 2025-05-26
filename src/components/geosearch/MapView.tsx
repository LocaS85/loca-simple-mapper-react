
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface MapViewProps {
  transport?: TransportMode; // Optionnel maintenant car on utilise le store
}

const MapView: React.FC<MapViewProps> = ({ transport }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Utiliser le store Zustand
  const {
    userLocation,
    results,
    isLoading,
    filters
  } = useGeoSearchStore();

  console.log('MapView rendering with results:', results);
  console.log('MapView rendering with userLocation:', userLocation);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !isMapboxTokenValid()) return;
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    try {
      console.log('Initializing map with center:', userLocation || [2.35, 48.85]);
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation || [2.35, 48.85], // Utiliser la position depuis le store
        zoom: isMobile ? 10 : 12
      });
      
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });
      
      map.current = newMap;
      
      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: t("map.error"),
        description: t("map.errorLoading"),
        variant: "destructive",
      });
    }
  }, [isMobile, toast, userLocation, t]);

  // Ajuster la carte aux résultats
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Ajouter la localisation utilisateur aux limites
      bounds.extend(userLocation);
      
      // Ajouter tous les résultats aux limites s'il y en a
      if (results.length > 0) {
        console.log('Extending bounds with results:', results);
        results.forEach(place => {
          bounds.extend(place.coordinates);
        });
        
        map.current.fitBounds(bounds, {
          padding: isMobile ? { top: 80, bottom: 50, left: 20, right: 20 } : 100,
          maxZoom: isMobile ? 13 : 15
        });
      } else {
        // Si pas de résultats, centrer sur la position utilisateur
        console.log('No results, centering on user location');
        map.current.setCenter(userLocation);
        map.current.setZoom(isMobile ? 10 : 12);
      }
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [results, mapLoaded, userLocation, isMobile]);

  // Mettre à jour les marqueurs quand les résultats changent
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    console.log('Updating markers with results:', results);
    
    // Effacer les marqueurs existants
    const markerElements = document.querySelectorAll('.mapboxgl-marker');
    markerElements.forEach(marker => {
      marker.remove();
    });
    
    // Ajouter le marqueur de position utilisateur
    if (userLocation) {
      console.log('Adding user location marker');
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${t('geosearch.yourPosition')}</h3>
          </div>
        `))
        .addTo(map.current);
    }
    
    // Ajouter les marqueurs de résultats
    results.forEach(place => {
      console.log('Adding marker for place:', place);
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(place.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${place.name}</h3>
            <p>${place.address}</p>
            <p>${t('map.distance')}: ${place.distance} ${place.distance > 1 ? 'km' : 'm'}</p>
            <p>${t('map.duration')}: ${place.duration} min</p>
          </div>
        `))
        .addTo(map.current);
    });
    
  }, [results, mapLoaded, userLocation, t]);

  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="w-full h-full pt-24 pb-16">
      <div ref={mapContainer} className="relative w-full h-full">
        {/* Indicateur de chargement */}
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
