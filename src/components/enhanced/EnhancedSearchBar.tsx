
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBarProps, LocationSelectData, SearchResultData } from '@/types/searchTypes';
import AutoSuggestSearchClean from '../AutoSuggestSearchClean';

const EnhancedSearchBar: React.FC<SearchBarProps> = ({
  value = "",
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  className = "",
  isLoading = false
}) => {
  const [query, setQuery] = useState(value);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleResultSelect = useCallback((result: SearchResultData) => {
    const locationData: LocationSelectData = {
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address
    };
    onLocationSelect(locationData);
  }, [onLocationSelect]);

  return (
    <div className={`relative ${className}`}>
      <AutoSuggestSearchClean
        onResultSelect={handleResultSelect}
        placeholder={placeholder}
        initialValue={query}
        className="w-full"
      />
    </div>
  );
};

export default EnhancedSearchBar;
