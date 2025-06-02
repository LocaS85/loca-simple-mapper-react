
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { mapboxApiService } from '@/services/mapboxApiService';

interface AutoSuggestSearchProps {
  onResultSelect: (result: any) => void;
  placeholder?: string;
  initialValue?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const AutoSuggestSearch: React.FC<AutoSuggestSearchProps> = ({
  onResultSelect,
  placeholder = "Rechercher un lieu...",
  initialValue = "",
  onBlur,
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMinCharWarning, setShowMinCharWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchPlaces(debouncedQuery);
      setShowMinCharWarning(false);
    } else if (debouncedQuery.length > 0) {
      setShowMinCharWarning(true);
      setSuggestions([]);
    } else {
      setSuggestions([]);
      setShowMinCharWarning(false);
    }
  }, [debouncedQuery]);

  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await mapboxApiService.searchPlaces(searchQuery, [2.3522, 48.8566], {
        limit: 5,
        country: 'fr'
      });
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.place_name || suggestion.name);
    setShowSuggestions(false);
    setShowMinCharWarning(false);
    onResultSelect(suggestion);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowMinCharWarning(false);
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 h-9"
        />
      </div>

      {/* Popup d'avertissement caractères minimum */}
      {showMinCharWarning && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700 z-50">
          Tapez au moins 2 caractères pour voir les suggestions
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-2"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name || suggestion.place_name}
                </div>
                {suggestion.place_name && suggestion.name !== suggestion.place_name && (
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.place_name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md p-3 text-center text-sm text-gray-500 z-50">
          Recherche en cours...
        </div>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
