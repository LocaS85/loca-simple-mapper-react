
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { GeoSearchFilters } from '@/types/geosearch';
import AutoSuggestSearch from './AutoSuggestSearch';

interface SearchHeaderProps {
  filters: {
    category?: string | null;
    subcategory?: string | null;
    transport: string;
    distance: number;
    unit: string;
    query?: string;
  };
  onToggleFilters: () => void;
  onSearch?: (query: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onSearch,
  onLocationSelect
}) => {
  const navigate = useNavigate();

  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    if (onSearch) {
      onSearch(location.name);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md p-3">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={() => navigate('/categories')}
          aria-label="Retour aux catégories"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <AutoSuggestSearch 
            onResultSelect={handleLocationSelect}
            placeholder="Rechercher un lieu ou une adresse..."
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={onToggleFilters}
          aria-label="Filtres"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.category && (
          <Badge variant="secondary" className="text-xs">
            Catégorie: {filters.category}
          </Badge>
        )}
        {filters.subcategory && (
          <Badge variant="secondary" className="text-xs">
            Sous-catégorie: {filters.subcategory}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          Transport: {filters.transport}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Distance max: {filters.distance} {filters.unit}
        </Badge>
      </div>
    </div>
  );
};

export default SearchHeader;
