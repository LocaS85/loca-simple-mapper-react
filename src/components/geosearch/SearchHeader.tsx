
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';

interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

interface SearchHeaderProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onLocationSelect: (location: LocationSelectData) => void;
  onResetFilters: () => void;
  onUpdateFilters: (filters: Partial<GeoSearchFilters>) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  results,
  isLoading,
  onSearch,
  onLocationSelect,
  onResetFilters,
  onUpdateFilters
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher des lieux..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {results.length} résultat{results.length > 1 ? 's' : ''}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          disabled={isLoading}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
