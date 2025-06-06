
import React from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import SearchPopup from './SearchPopup';
import FiltersFloatingButton from './FiltersFloatingButton';
import EnhancedLocationButton from './EnhancedLocationButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

interface FloatingControlsProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query?: string) => void;
  onMyLocationClick: (coordinates: [number, number]) => void;
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
    onSearch(query);
  };

  return (
    <>
      {/* Main controls at top - responsive layout */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-4xl mx-auto">
          {/* Search bar with integrated controls */}
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <SearchPopup
                filters={filters}
                onLocationSelect={onLocationSelect}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
            
            {/* Controls inline on desktop, below on mobile */}
            <div className={`flex gap-2 ${isMobile ? 'w-full justify-between' : 'shrink-0'}`}>
              <FiltersFloatingButton
                filters={filters}
                onChange={onFiltersChange}
                onReset={onResetFilters}
                isLoading={isLoading}
              />
              <EnhancedLocationButton
                onLocationDetected={onMyLocationClick}
                disabled={isLoading}
                variant="outline"
                size="sm"
                isIconOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Active filters indicators */}
        {(filters.category || filters.transport !== 'walking' || filters.distance !== 10) && (
          <div className="mt-3 flex flex-wrap gap-2 max-w-4xl mx-auto">
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                📍 {filters.category}
              </span>
            )}
            {filters.transport !== 'walking' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                🚶 {filters.transport}
              </span>
            )}
            {filters.distance !== 10 && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                📏 {filters.distance} {filters.unit}
              </span>
            )}
            {filters.maxDuration !== 20 && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                ⏱️ {filters.maxDuration} min
              </span>
            )}
          </div>
        )}

        {/* Results count indicator */}
        <div className="mt-2 flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Recherche en cours...
              </span>
            ) : (
              <span>Prêt pour la recherche</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingControls;
