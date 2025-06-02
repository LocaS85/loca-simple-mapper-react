
import React from 'react';
import { Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  // Handle location selection from AutoSuggestSearch
  const handleAutoSuggestLocationSelect = (result: any) => {
    if (result && result.coordinates) {
      onLocationSelect({
        name: result.name || result.place_name || '',
        coordinates: result.coordinates,
        placeName: result.place_name || result.name || ''
      });
    }
  };

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

        {/* Barre de recherche principale avec auto-suggestion */}
        <div className="flex-1 max-w-2xl">
          <AutoSuggestSearch
            onResultSelect={handleAutoSuggestLocationSelect}
            placeholder={t('geosearch.searchPlaceholder')}
            initialValue={filters.query}
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
