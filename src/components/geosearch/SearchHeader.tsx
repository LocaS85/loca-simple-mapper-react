
import React from 'react';
import { Filter, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AutoSuggestSearch from './AutoSuggestSearch';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface SearchHeaderProps {
  filters: GeoSearchFilters;
  onToggleFilters: () => void;
  onLocationSelect: (location: { 
    name: string; 
    coordinates: [number, number]; 
    placeName: string 
  }) => void;
  onRequestUserLocation: () => void;
  onSearch?: (query?: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onLocationSelect,
  onRequestUserLocation,
  onSearch
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState(filters.query || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  React.useEffect(() => {
    setSearchQuery(filters.query || '');
  }, [filters.query]);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-white shadow-md border-b">
      <div className="flex items-center gap-2 p-4">
        {/* Bouton de géolocalisation */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRequestUserLocation}
          className="shrink-0"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">
            {t('geosearch.myLocation')}
          </span>
        </Button>

        {/* Barre de recherche principale */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              placeholder={t('geosearch.searchPlaceholder')}
              value={searchQuery}
              onChange={handleInputChange}
              className="pr-10"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Composant de suggestion auto */}
        <div className="flex-1 max-w-sm">
          <AutoSuggestSearch
            onLocationSelect={onLocationSelect}
            placeholder={t('geosearch.searchLocationPlaceholder')}
          />
        </div>

        {/* Bouton filtres */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">
            {t('geosearch.filters')}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
