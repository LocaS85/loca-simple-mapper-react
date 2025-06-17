
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useSearchIntegrationContext } from './GeoSearchController';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { SearchResultData } from '@/types/searchTypes';

interface IntegratedSearchBarProps {
  placeholder?: string;
  className?: string;
}

const IntegratedSearchBar: React.FC<IntegratedSearchBarProps> = ({
  placeholder = "Rechercher des lieux, restaurants...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResultData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const { onSearchSelect, onDirectSearch } = useSearchIntegrationContext();
  const { userLocation, filters } = useGeoSearchStore();

  const loadSuggestions = useCallback(async (searchQuery: string) => {
    if (!userLocation || !searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await enhancedGeocodingService.searchPlaces(
        searchQuery, 
        userLocation, 
        {
          limit: 5,
          radius: 10,
          language: 'fr'
        }
      );
      
      const formattedResults: SearchResultData[] = results.map((result, index) => ({
        id: result.id || `result-${index}`,
        name: result.name || result.address?.split(',')[0] || 'Lieu',
        address: result.address || 'Adresse non disponible',
        coordinates: result.coordinates,
        distance: result.distance
      }));
      
      setSuggestions(formattedResults);
      setShowSuggestions(formattedResults.length > 0);
    } catch (error) {
      console.error('Erreur de chargement des suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery, loadSuggestions]);

  useEffect(() => {
    if (filters.query && filters.query !== query) {
      setQuery(filters.query);
    }
  }, [filters.query, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onDirectSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: SearchResultData) => {
    setQuery(suggestion.name || suggestion.address);
    setShowSuggestions(false);
    
    onSearchSelect({
      id: suggestion.id,
      text: suggestion.name || suggestion.address,
      place_name: suggestion.address,
      center: suggestion.coordinates,
      properties: {}
    });
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="pl-10 pr-10 h-12 text-base border-gray-200 focus:border-blue-500"
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
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>
        
        <Button type="submit" disabled={!query.trim()} className="h-12 px-6">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name || suggestion.address?.split(',')[0]}
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

export default IntegratedSearchBar;
