
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import AutoSuggestSearchClean from '../AutoSuggestSearchClean';

interface EnhancedSearchBarProps {
  value: string;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value,
  onSearch,
  onLocationSelect,
  isLoading = false,
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

  const handleResultSelect = (result: any) => {
    onLocationSelect({
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address
    });
  };

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
