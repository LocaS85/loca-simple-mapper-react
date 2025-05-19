
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onSearch
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState(filters.query || '');

  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
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
        
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <MapPin className="text-gray-500 h-4 w-4 shrink-0" />
          <Input 
            className="border-0 bg-transparent shadow-none p-0 h-auto focus-visible:ring-0"
            placeholder="Rechercher un lieu ou une adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
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
