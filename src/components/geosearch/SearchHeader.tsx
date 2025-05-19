
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import AutoSuggestSearch from './AutoSuggestSearch';
import { GeoSearchFilters } from '@/types/geosearch';

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

  // Format transport mode for display
  const formatTransport = (transport: string) => {
    switch (transport) {
      case 'car':
        return 'Voiture';
      case 'walking':
        return 'À pied';
      case 'cycling':
        return 'Vélo';
      case 'transit':
        return 'Transport en commun';
      default:
        return transport;
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
            initialValue={filters.query || ""}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0 relative"
          onClick={onToggleFilters}
          aria-label="Filtres"
        >
          <Filter className="h-4 w-4" />
          {/* Add a badge indicator when filters are applied */}
          {(filters.category || filters.subcategory) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          )}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.query && (
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1">
            <MapPin size={12} />
            {filters.query}
          </Badge>
        )}
        {filters.category && (
          <Badge variant="secondary" className="text-xs">
            Catégorie: {filters.category}
          </Badge>
        )}
        {filters.subcategory && (
          <Badge variant="secondary" className="text-xs">
            {filters.subcategory}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          {formatTransport(filters.transport)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {filters.distance} {filters.unit}
        </Badge>
      </div>
    </div>
  );
};

export default SearchHeader;
