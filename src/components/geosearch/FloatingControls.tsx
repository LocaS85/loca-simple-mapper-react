
import React from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import SearchPopup from './SearchPopup';
import FiltersFloatingButton from './FiltersFloatingButton';
import EnhancedLocationButton from './EnhancedLocationButton';

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
  return (
    <>
      {/* Contrôles principaux en haut - layout responsive */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Barre de recherche */}
          <div className="flex-1">
            <SearchPopup
              filters={filters}
              onLocationSelect={onLocationSelect}
              onSearch={onSearch}
              isLoading={isLoading}
            />
          </div>
          
          {/* Contrôles - Filtres et Ma Position */}
          <div className="flex gap-2 justify-end sm:justify-start">
            <FiltersFloatingButton
              filters={filters}
              onChange={onFiltersChange}
              onReset={onResetFilters}
              isLoading={isLoading}
            />
            <EnhancedLocationButton
              onLocationDetected={onMyLocationClick}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Indicateurs de filtres actifs */}
        {(filters.category || filters.transport !== 'walking' || filters.distance !== 10) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {filters.category}
              </span>
            )}
            {filters.transport !== 'walking' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                {filters.transport}
              </span>
            )}
            {filters.distance !== 10 && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                {filters.distance} {filters.unit}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingControls;
