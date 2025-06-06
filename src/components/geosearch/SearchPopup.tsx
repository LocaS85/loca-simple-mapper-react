
import React from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import EnhancedSearchBar from '../enhanced/EnhancedSearchBar';

interface SearchPopupProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  filters,
  onLocationSelect,
  onSearch,
  isLoading = false
}) => {
  return (
    <div className="w-full">
      <EnhancedSearchBar
        value={filters.query || ''}
        onSearch={onSearch}
        onLocationSelect={onLocationSelect}
        isLoading={isLoading}
        placeholder="Rechercher des lieux, restaurants, services..."
        className="w-full"
      />
    </div>
  );
};

export default SearchPopup;
