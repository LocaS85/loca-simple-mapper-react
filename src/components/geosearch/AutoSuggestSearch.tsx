
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { mapboxApiService } from '@/services/mapboxApiService';
import { useTranslation } from 'react-i18next';

interface AutoSuggestSearchProps {
  onResultSelect: (result: any) => void;
  placeholder?: string;
  initialValue?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
  showMyLocationButton?: boolean;
  onMyLocationClick?: () => void;
}

const AutoSuggestSearch: React.FC<AutoSuggestSearchProps> = ({
  onResultSelect,
  placeholder = "Rechercher un lieu...",
  initialValue = "",
  onBlur,
  autoFocus = false,
  showMyLocationButton = true,
  onMyLocationClick
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (initialValue && initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchPlaces(debouncedQuery);
      setError(null);
    } else if (debouncedQuery.length > 0) {
      setSuggestions([]);
      setError("Tapez au moins 2 caractères");
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [debouncedQuery]);

  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await mapboxApiService.searchPlaces(searchQuery, [2.3522, 48.8566], {
        limit: 5,
        radius: 50
      });
      
      setSuggestions(results);
      setShowSuggestions(true);
      
      if (results.length === 0) {
        setError("Aucun résultat trouvé");
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setError("Erreur de recherche");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const displayName = suggestion.name || suggestion.address.split(',')[0];
    setQuery(displayName);
    setShowSuggestions(false);
    setError(null);
    
    onResultSelect({
      ...suggestion,
      place_name: suggestion.address,
      center: suggestion.coordinates
    });
  };

  const handleMyLocationClick = async () => {
    if (!onMyLocationClick) return;
    
    setIsGeolocating(true);
    setError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Géolocalisation non supportée");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
      
      // Reverse geocoding pour obtenir l'adresse
      const results = await mapboxApiService.searchPlaces('', coords, { limit: 1 });
      const locationName = results[0]?.address || "Ma position";
      
      setQuery(locationName);
      onMyLocationClick();
      
      onResultSelect({
        id: 'user-location',
        name: locationName,
        address: locationName,
        coordinates: coords,
        place_name: locationName,
        center: coords
      });
      
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      setError("Impossible d'obtenir votre position");
    } finally {
      setIsGeolocating(false);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-10 pr-12 h-9"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>
        
        {showMyLocationButton && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMyLocationClick}
            disabled={isGeolocating}
            className="ml-2 h-9 px-3 shrink-0"
            title="Utiliser ma position"
          >
            {isGeolocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700 z-50 flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
