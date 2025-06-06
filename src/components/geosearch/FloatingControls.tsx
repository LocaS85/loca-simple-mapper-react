import React, { useState } from 'react';
import { Search, SlidersHorizontal, Loader2, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeoSearchFilters } from '@/types/geosearch';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedLocationButton from './EnhancedLocationButton';

interface FloatingControlsProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query?: string) => void;
  onMyLocationClick: (coordinates: [number, number]) => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  filters,
  onLocationSelect,
  onSearch,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const isMobile = useIsMobile();

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
    console.log('📍 Nouvelle position détectée:', coordinates);
    onMyLocationClick(coordinates);
  };

  return (
    <div className="relative w-full h-full">
      <form onSubmit={handleSearch} className="flex items-center gap-1 h-full">
        <div className="relative flex-1 h-full">
          <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'
          }`} />
          <Input
            type="text"
            placeholder={isMobile ? "Rechercher..." : "Rechercher un lieu, restaurant..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={`${isMobile ? 'pl-7 pr-2 text-xs' : 'pl-8 pr-3 text-sm'} h-full w-full border-gray-200 rounded-lg`}
            disabled={isLoading}
          />
          {isSearching && (
            <Loader2 className={`absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500 ${
              isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'
            }`} />
          )}
        </div>
        
        <Button 
          type="submit" 
          size={isMobile ? "sm" : "default"}
          disabled={isLoading}
          className={`shrink-0 ${isMobile ? 'h-8 w-8 p-0' : 'h-9 px-3'}`}
        >
          {isLoading ? (
            <Loader2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          ) : (
            <Search className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
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
  );
};

export default FloatingControls;
