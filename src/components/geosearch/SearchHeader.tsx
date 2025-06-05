
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Loader2, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeoSearchFilters } from '@/types/geosearch';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useDebounce } from '@/hooks/useDebounce';
import EnhancedLocationButton from './EnhancedLocationButton';

interface SearchHeaderProps {
  filters: GeoSearchFilters;
  onToggleFilters: () => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query?: string) => void;
  onMyLocationClick: (coordinates: [number, number]) => void;
  isLoading?: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onToggleFilters,
  onLocationSelect,
  onSearch,
  onMyLocationClick,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Recherche automatique avec auto-suggestion
  React.useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const searchSuggestions = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      // Utiliser la position utilisateur comme centre si disponible
      const center: [number, number] = [2.3522, 48.8566]; // Paris par défaut
      
      const results = await enhancedGeocodingService.searchPlaces(query, center, {
        limit: 5,
        radius: 50,
        language: 'fr'
      });
      
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('❌ Erreur de recherche auto-suggestion:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    
    onLocationSelect({
      name: suggestion.name,
      coordinates: suggestion.coordinates,
      placeName: suggestion.address
    });
  };

  const handleLocationDetected = (coordinates: [number, number]) => {
    console.log('📍 Nouvelle position détectée dans SearchHeader:', coordinates);
    onMyLocationClick(coordinates);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center gap-3 p-4">
        {/* Barre de recherche avec auto-suggestion */}
        <div className="flex-1 relative">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un lieu, restaurant, hôtel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 pr-4 py-2 w-full"
                disabled={isLoading}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
              )}
            </div>
            
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>

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
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.address}
                    </div>
                    {suggestion.distance && (
                      <div className="text-xs text-blue-600">
                        {suggestion.distance} km
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Ma Position amélioré avec icône */}
        <EnhancedLocationButton
          onLocationDetected={handleLocationDetected}
          disabled={isLoading}
          className="shrink-0"
        />

        {/* Bouton Filtres */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="shrink-0 bg-white/90 backdrop-blur-sm"
          disabled={isLoading}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Filtres</span>
        </Button>
      </div>

      {/* Indicateurs de filtres actifs */}
      {(filters.category || filters.transport !== 'walking' || filters.distance !== 10) && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {filters.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {filters.category}
              </span>
            )}
            {filters.transport !== 'walking' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Transport: {filters.transport}
              </span>
            )}
            {filters.distance !== 10 && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                {filters.distance} {filters.unit}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
