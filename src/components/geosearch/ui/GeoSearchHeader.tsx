
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, MapPin, RotateCcw } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import EnhancedLocationButton from '../EnhancedLocationButton';
import FiltersFloatingButton from '../FiltersFloatingButton';

interface GeoSearchHeaderProps {
  filters: GeoSearchFilters;
  isLoading: boolean;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
    isReady: boolean;
  };
}

const GeoSearchHeader: React.FC<GeoSearchHeaderProps> = ({
  filters,
  isLoading,
  onSearch,
  onLocationSelect,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  onToggleSidebar,
  isMobile,
  statusInfo
}) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="p-4">
        {/* Ligne principale */}
        <div className="flex items-center gap-3 mb-3">
          {/* Menu burger */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSidebar}
            className="shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Titre et statut */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {isMobile ? 'GeoSearch' : 'Recherche Géographique'}
            </h1>
            {statusInfo.isReady && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {statusInfo.totalResults}
              </Badge>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <EnhancedSearchBar
              value={filters.query || ''}
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
              isLoading={isLoading}
              placeholder="Rechercher des lieux, restaurants..."
              className="w-full"
            />
          </div>

          <EnhancedLocationButton
            onLocationDetected={onMyLocationClick}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="shrink-0"
          />
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-2">
          <FiltersFloatingButton
            filters={filters}
            onChange={onFiltersChange}
            onReset={onResetFilters}
            isLoading={isLoading}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeoSearchHeader;
