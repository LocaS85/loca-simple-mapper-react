
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';
import { LocationSelectData } from '@/types/searchTypes';
import EnhancedSearchBar from '@/components/enhanced/EnhancedSearchBar';
import BadgesFiltres from '@/components/filters/BadgesFiltres';
import { Button } from '@/components/ui/button';
import { Settings, MapPin } from 'lucide-react';

interface GeoSearchDesktopHeaderProps {
  isLoading: boolean;
  filters: GeoSearchFilters;
  results: SearchResult[];
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  handleMyLocationClick: () => void;
  handleSearch: (query: string) => void;
  handleLocationSelect: (location: LocationSelectData) => void;
  onFiltersClick: () => void;
}

const GeoSearchDesktopHeader: React.FC<GeoSearchDesktopHeaderProps> = ({
  isLoading,
  filters,
  results,
  updateFilters,
  resetFilters,
  handleMyLocationClick,
  handleSearch,
  handleLocationSelect,
  onFiltersClick
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 bg-white shadow-md border-b">
      <div className="p-4 space-y-4">
        {/* Search bar and buttons */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <EnhancedSearchBar
              onSearch={handleSearch}
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
              placeholder="Rechercher un lieu..."
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleMyLocationClick}
            className="shrink-0"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Ma position
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onFiltersClick}
            className="shrink-0"
          >
            <Settings className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Filter badges */}
        <div className="flex items-center justify-between">
          <BadgesFiltres
            transportMode={filters.transport}
            distance={filters.distance}
            distanceUnit="km"
            category={filters.category}
            subcategory={filters.subcategory}
            query={filters.query}
            aroundMeCount={filters.aroundMeCount}
            maxDuration={filters.maxDuration}
          />
          
          <Badge variant="secondary" className="text-xs ml-2">
            {results.length} résultat{results.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default GeoSearchDesktopHeader;
