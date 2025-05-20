
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, MapPin, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import AutoSuggestSearch from './AutoSuggestSearch';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface SearchHeaderProps {
  filters: GeoSearchFilters;
  onToggleFilters: () => void;
  onSearch?: (query: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onRequestUserLocation?: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onSearch,
  onLocationSelect,
  onRequestUserLocation
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLocationSelect = (location: { name: string; coordinates: [number, number]; placeName: string }) => {
    console.log('Location selected:', location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Format transport mode for display
  const formatTransport = (transport: string) => {
    switch (transport) {
      case 'car':
        return t('filters.transportModes.car');
      case 'walking':
        return t('filters.transportModes.walking');
      case 'cycling':
        return t('filters.transportModes.cycling');
      case 'transit':
        return t('filters.transportModes.transit');
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
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <AutoSuggestSearch 
            onResultSelect={handleLocationSelect}
            placeholder={t('geosearch.searchPlaceholder')}
            initialValue={filters.query || ""}
          />
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={onRequestUserLocation}
          aria-label={t('map.yourLocation')}
          title={t('map.yourLocation')}
        >
          <Locate className="h-4 w-4 text-blue-600" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0 relative"
          onClick={onToggleFilters}
          aria-label={t('common.filters')}
        >
          <Filter className="h-4 w-4" />
          {/* Add a badge indicator when filters are applied */}
          {(filters.category || filters.subcategory || filters.aroundMeCount > 3 || filters.showMultiDirections) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          )}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-full">
        {filters.query && (
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate max-w-[150px]">{filters.query}</span>
          </Badge>
        )}
        {filters.category && (
          <Badge variant="secondary" className="text-xs">
            {t('common.category')}: {filters.category}
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
        {filters.aroundMeCount > 3 && (
          <Badge variant="secondary" className="text-xs">
            {t('filters.aroundMe')}: {filters.aroundMeCount}
          </Badge>
        )}
        {filters.showMultiDirections && (
          <Badge variant="secondary" className="text-xs">
            {t('filters.multiDirections')}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
