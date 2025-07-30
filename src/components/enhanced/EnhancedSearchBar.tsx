
import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2, X } from 'lucide-react';

// Interfaces pour le composant unifié
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

interface EnhancedSearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  onLocationSelect?: (data: LocationSelectData) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  showSuggestions?: boolean;
  suggestions?: SearchResultData[];
  onSuggestionClick?: (suggestion: SearchResultData) => void;
  // Props pour compatibilité avec ancienne interface
  onChange?: (value: string) => void;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = memo(({
  value = "",
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  className = "",
  isLoading = false,
  disabled = false,
  showSuggestions: propShowSuggestions = true,
  suggestions: propSuggestions = [],
  onSuggestionClick,
  onChange
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onChange?.('');
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
  }, [onChange]);

  // Utiliser les suggestions fournies ou celles générées localement
  const displaySuggestions = propSuggestions.length > 0 ? propSuggestions : suggestions;
  const showSuggestionsState = propShowSuggestions && (showSuggestions || propSuggestions.length > 0);

  const containerVariants = {
    idle: { scale: 1 },
    focused: { scale: 1.02 },
    loading: { scale: 1.01 }
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        animate={isLoading ? 'loading' : 'idle'}
        whileFocus="focused"
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => displaySuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={`
              pl-10 pr-20 h-12 text-base
              border-border/50 hover:border-primary/50 
              focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* Boutons d'action */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {(isSearching || isLoading) && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            
            {query && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={disabled || !query.trim() || isLoading}
              className="h-8 px-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Suggestions dropdown avec animations */}
      {showSuggestionsState && displaySuggestions.length > 0 && (
        <motion.div
          variants={suggestionVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="p-2 space-y-1">
            {displaySuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                type="button"
                onClick={() => {
                  handleResultSelect(suggestion);
                  onSuggestionClick?.(suggestion);
                }}
                className={`
                  w-full text-left p-3 rounded-md hover:bg-muted 
                  transition-colors duration-150 focus:outline-none 
                  focus:ring-2 focus:ring-primary/50
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 }
                }}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {suggestion.address}
                    </p>
                    {suggestion.distance && (
                      <p className="text-xs text-primary">
                        {Math.round(suggestion.distance * 10) / 10} km
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});

EnhancedSearchBar.displayName = 'EnhancedSearchBar';

export default EnhancedSearchBar;
