import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mapboxSearchService } from '@/services/mapbox/searchService';

interface SimpleEnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  userLocation?: [number, number];
  disabled?: boolean;
  className?: string;
}

const SimpleEnhancedSearchBar: React.FC<SimpleEnhancedSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  userLocation,
  disabled = false,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-suggestion avec Mapbox
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          if (userLocation) {
            const results = await mapboxSearchService.searchPlaces(value, userLocation, { limit: 5 });
            setSuggestions(results);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Erreur autosuggestion:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, userLocation]);

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.name);
    onSearch(suggestion.name);
    if (onLocationSelect) {
      onLocationSelect({
        name: suggestion.name,
        coordinates: suggestion.coordinates,
        placeName: suggestion.address
      });
    }
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{suggestion.name}</div>
                <div className="text-xs text-muted-foreground truncate">{suggestion.address}</div>
                {suggestion.distance && (
                  <div className="text-xs text-muted-foreground">
                    {suggestion.distance.toFixed(1)} km
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

export default SimpleEnhancedSearchBar;