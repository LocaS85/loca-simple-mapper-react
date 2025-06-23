
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: number;
}

interface UnifiedSearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  onLocationSelect?: (location: {
    name: string;
    coordinates: [number, number];
    placeName: string;
  }) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  showSuggestions?: boolean;
  proximity?: [number, number];
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  value = "",
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  className = "",
  isLoading = false,
  showSuggestions = true,
  proximity,
  disabled = false,
  size = 'md'
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  const sizeStyles = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  };

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const loadSuggestions = useCallback(async (searchQuery: string): Promise<void> => {
    if (!showSuggestions || !searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    setIsSearching(true);
    try {
      const center = proximity || [2.3522, 48.8566]; // Default to Paris
      
      const results = await enhancedGeocodingService.searchPlaces(
        searchQuery, 
        center, 
        {
          limit: 5,
          radius: 10,
          language: 'fr'
        }
      );
      
      const formattedResults: SearchResult[] = results.map((result, index) => ({
        id: result.id || `result-${index}`,
        name: result.name || result.address?.split(',')[0] || 'Lieu',
        address: result.address || 'Adresse non disponible',
        coordinates: result.coordinates,
        distance: result.distance
      }));
      
      setSuggestions(formattedResults);
      setShowSuggestionsList(formattedResults.length > 0);
    } catch (error) {
      console.error('Erreur de recherche auto-suggestion:', error);
      setSuggestions([]);
      setShowSuggestionsList(false);
    } finally {
      setIsSearching(false);
    }
  }, [showSuggestions, proximity]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [debouncedQuery, loadSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestionsList(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.name);
    setShowSuggestionsList(false);
    
    if (onLocationSelect) {
      onLocationSelect({
        name: suggestion.name,
        coordinates: suggestion.coordinates,
        placeName: suggestion.address
      });
    }
    
    onSearch(suggestion.name);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestionsList(true)}
          onBlur={() => setTimeout(() => setShowSuggestionsList(false), 200)}
          placeholder={placeholder}
          className={`pl-10 pr-10 ${sizeStyles[size]} border-gray-200 focus:border-blue-500`}
          disabled={disabled || isLoading}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {(isSearching || isLoading) && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
        )}
      </form>

      {showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${index}`}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {suggestion.address}
                </div>
                {suggestion.distance && (
                  <div className="text-xs text-blue-600">
                    {Math.round(suggestion.distance * 10) / 10} km
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchBar;
