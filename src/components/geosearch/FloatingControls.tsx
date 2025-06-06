
import React from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import SearchPopup from './SearchPopup';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

interface FloatingControlsProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query?: string) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  filters,
  onLocationSelect,
  onSearch,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  isLoading = false
}) => {
  const isMobile = useIsMobile();

  const handleSearch = (query: string) => {
    console.log('🔍 FloatingControls - Recherche:', query);
    onSearch(query);
  };

  return (
    <div className="w-full">
      {/* Barre de recherche principale - Hauteur fixe pour alignement */}
      <div className="w-full">
        <SearchPopup
          filters={filters}
          onLocationSelect={onLocationSelect}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {/* Badges des filtres actifs - Espacement optimisé */}
      {(filters.category || filters.transport !== 'walking' || filters.distance !== 10 || filters.maxDuration !== 20) && (
        <div className={`${isMobile ? 'mt-2' : 'mt-3'} flex flex-wrap gap-2 justify-start`}>
          {filters.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              📍 {filters.category}
            </span>
          )}
          {filters.transport !== 'walking' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              🚶 {filters.transport}
            </span>
          )}
          {filters.distance !== 10 && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              📏 {filters.distance} {filters.unit}
            </span>
          )}
          {filters.maxDuration !== 20 && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              ⏱️ {filters.maxDuration} min
            </span>
          )}
        </div>
      )}

      {/* Indicateur de statut - Position optimisée */}
      {isLoading && (
        <div className={`${isMobile ? 'mt-2' : 'mt-3'} flex justify-start`}>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm border border-gray-200">
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              Recherche en cours...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingControls;
