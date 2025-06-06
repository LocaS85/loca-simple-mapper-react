
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface EnhancedSearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  value = '',
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher un lieu ou un type d'établissement...",
  className = '',
  isLoading = false
}) => {
  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (debouncedQuery !== value && debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, value]);

  React.useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } rounded-lg`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base border-gray-200 focus:border-blue-500"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!query.trim() || isLoading}
            className="h-8 px-3 bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Search suggestions could be added here */}
      {isFocused && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-3 text-sm text-gray-500 border-b">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Appuyez sur Entrée pour rechercher "{query}"
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default EnhancedSearchBar;
