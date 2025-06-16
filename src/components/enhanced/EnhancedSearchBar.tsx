
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import AutoSuggestSearchClean from '../AutoSuggestSearchClean';

interface EnhancedSearchBarProps {
  value: string;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  className = ""
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

  const handleResultSelect = useCallback((result: {
    id: string;
    name: string;
    address: string;
    coordinates: [number, number];
  }) => {
    onLocationSelect({
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address
    });
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
