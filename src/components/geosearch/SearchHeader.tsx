
import React, { useState } from 'react';
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
  onSearch?: (query?: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onLocationSelect,
  onSearch
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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
    <>
      {/* Header collapsé */}
      {!isExpanded && (
        <div className="absolute top-4 left-4 right-20 z-30">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="flex-1 justify-start h-8 text-sm text-gray-600"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Rechercher un lieu...
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="shrink-0 h-8 w-8 p-0"
                title={t('geosearch.filters')}
              >
                <Filter className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header étendu */}
      {isExpanded && (
        <div className="absolute top-4 left-4 right-20 z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <AutoSuggestSearch
                  onResultSelect={handleAutoSuggestLocationSelect}
                  placeholder={t('geosearch.searchPlaceholder')}
                  initialValue={filters.query}
                  onBlur={() => setIsExpanded(false)}
                  autoFocus={true}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFilters}
                className="shrink-0 h-9 w-9 p-0"
                title={t('geosearch.filters')}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchHeader;
