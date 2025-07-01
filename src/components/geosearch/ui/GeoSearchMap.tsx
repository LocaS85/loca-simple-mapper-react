
import React, { useEffect, useRef } from 'react';
import MapboxMap from '../../MapboxMap';
import { SearchResult } from '@/types/geosearch';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface GeoSearchMapProps {
  results: SearchResult[];
  userLocation: [number, number] | null;
  transport: string;
  category?: string;
}

const GeoSearchMap: React.FC<GeoSearchMapProps> = ({
  results,
  userLocation,
  transport,
  category
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { isMapboxReady } = useGeoSearchStore();

  // Debug et centrer la carte sur les résultats ou la position utilisateur
  useEffect(() => {
    console.log('📍 GeoSearchMap - userLocation:', userLocation);
    console.log('🔍 GeoSearchMap - results:', results.length);
    console.log('🗺️ GeoSearchMap - isMapboxReady:', isMapboxReady);
    
    if (isMapboxReady && userLocation && results.length > 0) {
      console.log('🗺️ Mise à jour de la carte avec', results.length, 'résultats');
    }
  }, [results, userLocation, isMapboxReady]);

  if (!isMapboxReady) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <MapboxMap
        results={results}
        transport={transport}
        category={category}
        className="w-full h-full rounded-none border-0"
      />
    </div>
  );
};

export default GeoSearchMap;
