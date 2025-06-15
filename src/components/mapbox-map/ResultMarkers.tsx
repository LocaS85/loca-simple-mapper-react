
import React from 'react';
import { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface ResultMarkersProps {
  results: SearchResult[];
  category?: string;
}

const getColorForCategory = (cat: string) => {
  switch (cat?.toLowerCase()) {
    case 'restaurant':
    case 'food':
      return '#e67e22';
    case 'health':
    case 'santé':
      return '#27ae60';
    case 'entertainment':
    case 'divertissement':
      return '#8e44ad';
    case 'shopping':
      return '#f39c12';
    default:
      return '#3498db';
  }
};

const ResultMarkers: React.FC<ResultMarkersProps> = ({ results, category }) => (
  <>
    {results.map((result, index) =>
      result.coordinates ? (
        <Marker
          key={result.id || index}
          longitude={result.coordinates[0]}
          latitude={result.coordinates[1]}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <MapPin
              className="w-6 h-6 drop-shadow-md"
              style={{ color: getColorForCategory(result.category || category) }}
              role="img"
              aria-label={`Marqueur pour ${result.name}`}
            />
            <div
              className="text-xs bg-white px-1 rounded shadow-sm max-w-20 truncate"
              title={result.name}
            >
              {result.name}
            </div>
          </div>
        </Marker>
      ) : null
    )}
  </>
);

export default ResultMarkers;
