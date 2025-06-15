
import React from 'react';
import MapboxMap from '../../MapboxMap';
import { SearchResult } from '@/types/geosearch';

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
  return (
    <div className="w-full h-full">
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
