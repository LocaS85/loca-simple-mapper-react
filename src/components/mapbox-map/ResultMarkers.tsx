
import React from 'react';
import { Marker } from 'react-map-gl';
import { MapPin, Store, Utensils, Building2, Car, Heart, ShoppingBag } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface ResultMarkersProps {
  results: SearchResult[];
  category?: string;
  onResultClick?: (result: SearchResult) => void;
}

const getCategoryIcon = (category: string, isLarge?: boolean) => {
  const size = isLarge ? 20 : 16;
  switch (category?.toLowerCase()) {
    case 'restaurant':
    case 'food':
      return <Utensils size={size} />;
    case 'shopping':
      return <ShoppingBag size={size} />;
    case 'health':
    case 'santé':
      return <Heart size={size} />;
    case 'fuel':
      return <Car size={size} />;
    case 'finance':
      return <Building2 size={size} />;
    default:
      return <Store size={size} />;
  }
};

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
    case 'fuel':
      return '#e74c3c';
    case 'finance':
      return '#2980b9';
    default:
      return '#3498db';
  }
};

const ResultMarkers: React.FC<ResultMarkersProps> = ({ results, category, onResultClick }) => {
  // Filtrer les résultats avec coordonnées valides
  const validResults = results.filter(result => 
    result.coordinates && 
    result.coordinates[0] !== 0 && 
    result.coordinates[1] !== 0 &&
    Math.abs(result.coordinates[0]) <= 180 && 
    Math.abs(result.coordinates[1]) <= 90
  );
  
  console.log('🗺️ Marqueurs POI valides:', validResults.length, '/', results.length);

  return (
    <>
      {validResults.map((result, index) => (
        <Marker
          key={result.id || index}
          longitude={result.coordinates[0]}
          latitude={result.coordinates[1]}
          anchor="bottom"
          onClick={onResultClick ? () => onResultClick(result) : undefined}
        >
          <div 
            className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
            title={`${result.name} - ${result.address}`}
          >
            <div 
              className="p-2 rounded-full shadow-lg border-2 border-white"
              style={{ backgroundColor: getColorForCategory(result.category || category) }}
            >
              <div className="text-white">
                {getCategoryIcon(result.category || category || '', true)}
              </div>
            </div>
            <div className="bg-white px-2 py-1 rounded shadow-md max-w-32 text-center">
              <div className="text-xs font-medium truncate" title={result.name}>
                {result.name}
              </div>
              {result.distance && (
                <div className="text-xs text-muted-foreground">
                  {result.distance < 1 
                    ? `${Math.round(result.distance * 1000)}m` 
                    : `${result.distance.toFixed(1)}km`
                  }
                </div>
              )}
            </div>
          </div>
        </Marker>
      ))}
    </>
  );
};

export default ResultMarkers;
