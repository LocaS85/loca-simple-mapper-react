
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBarProps } from '@/types/unified';

// Interfaces locales pour compatibilité 
interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

interface SearchResultData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  distance?: number;
  category?: string;
}
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';

const EnhancedSearchBar: React.FC<SearchBarProps> = ({
  value = "",
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  className = "",
  isLoading = false
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchResultData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  // Récupérer la position utilisateur du store
  const { userLocation } = useGeoSearchStore();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const loadSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      // Utiliser la position utilisateur si disponible, sinon Paris par défaut
      const center: [number, number] = userLocation || [2.3522, 48.8566];
      
      const results = await enhancedGeocodingService.searchPlaces(
        searchQuery, 
        center, 
        {
          limit: 5,
          radius: userLocation ? 20 : 50, // Rayon plus petit si position précise
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
      console.error('Erreur de recherche auto-suggestion:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery);
    } else if (debouncedQuery) {
      // Déclencher la recherche même sans suggestions pour les requêtes courtes
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, loadSuggestions]);

  const handleResultSelect = useCallback((result: SearchResultData) => {
    const locationData: LocationSelectData = {
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address
    };
    setQuery(result.name);
    setShowSuggestions(false);
    onLocationSelect(locationData);
  }, [onLocationSelect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="pl-8 pr-8 h-8 bg-white/95 backdrop-blur-sm border-gray-200 focus:border-blue-500 text-sm"
          disabled={isLoading}
        />
        {(isSearching || isLoading) && (
          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 animate-spin text-blue-500" />
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${index}`}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 transition-colors"
              onClick={() => handleResultSelect(suggestion)}
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

export default EnhancedSearchBar;
