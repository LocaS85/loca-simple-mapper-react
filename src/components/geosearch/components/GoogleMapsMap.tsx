import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { getMapboxToken } from '@/utils/mapboxConfig';
import MultiRouteManager from './MultiRouteManager';
import ResultMarkersManager from './ResultMarkersManager';

interface GoogleMapsMapProps {
  results: SearchResult[];
  userLocation: [number, number] | null;
  filters: GeoSearchFilters;
  onResultClick: (result: SearchResult) => void;
}

// Configuration des couleurs de transport Google Maps
export const TRANSPORT_COLORS = {
  car: '#0074D9',
  walking: '#2ECC40', 
  cycling: '#FF851B',
  bus: '#B10DC9'
} as const;

const GoogleMapsMap: React.FC<GoogleMapsMapProps> = ({
  results,
  userLocation,
  filters,
  onResultClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { isMapboxReady } = useGeoSearchStore();

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainerRef.current || !isMapboxReady) return;

    const initMap = async () => {
      try {
        const token = await getMapboxToken();
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: userLocation || [2.3522, 48.8566], // Paris par défaut
          zoom: userLocation ? 13 : 11,
          attributionControl: false
        });

        // Contrôles navigation
        map.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: false
          }),
          'bottom-right'
        );

        // Contrôle géolocalisation
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: false,
            showUserHeading: false
          }),
          'bottom-right'
        );

        map.on('load', () => {
          setIsMapReady(true);
          console.log('🗺️ Carte Google Maps chargée');
        });

        mapRef.current = map;

        return () => map.remove();
      } catch (error) {
        console.error('Erreur initialisation carte:', error);
      }
    };

    initMap();
  }, [isMapboxReady]);

  // Centrer sur la position utilisateur
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: userLocation,
        zoom: 13,
        duration: 1000
      });
    }
  }, [userLocation]);

  // Ajuster la vue aux résultats
  useEffect(() => {
    if (mapRef.current && isMapReady && results.length > 0 && userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Inclure la position utilisateur
      bounds.extend(userLocation);
      
      // Inclure tous les résultats
      results.forEach(result => {
        bounds.extend(result.coordinates);
      });

      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 300 }, // Espace pour sidebar
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [results, userLocation, isMapReady]);

  if (!isMapboxReady) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div id="google-maps-container" ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Gestionnaires de couches */}
      {mapRef.current && isMapReady && (
        <>
          <MultiRouteManager
            map={mapRef.current}
            userLocation={userLocation}
            results={results}
            transport={filters.transport}
            showMultiDirections={filters.showMultiDirections}
          />
          
          <ResultMarkersManager
            map={mapRef.current}
            results={results}
            userLocation={userLocation}
            onResultClick={onResultClick}
          />
        </>
      )}
    </div>
  );
};

export default GoogleMapsMap;