
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AutoSuggestSearch from './AutoSuggestSearch';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';
import FilterButton from '../filters/FilterButton';
import FilterBadges from '../filters/FilterBadges';
import { TransportMode } from '@/lib/data/transportModes';

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
          <Navigation className="h-4 w-4 text-blue-600" />
        </Button>
        
        <FilterButton 
          onClick={onToggleFilters}
          transportMode={filters.transport as TransportMode}
          distanceChanged={filters.distance !== 10}
          aroundMeChanged={filters.aroundMeCount > 3}
          showMultiDirections={filters.showMultiDirections}
        />
      </div>
      
      {(filters.query || filters.category || filters.subcategory || filters.aroundMeCount > 3) && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-full">
          <FilterBadges
            query={filters.query}
            category={filters.category}
            subcategory={filters.subcategory}
            transportMode={filters.transport as TransportMode}
            distance={filters.distance}
            distanceUnit={filters.unit}
            aroundMeCount={filters.aroundMeCount}
            showMultiDirections={filters.showMultiDirections}
          />
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
