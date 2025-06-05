
import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GeoSearchFilters } from '@/types/geosearch';
import { enhancedGeocodingService } from '@/services/mapbox/enhancedGeocodingService';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchPopupProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query?: string) => void;
  isLoading?: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  filters,
  onLocationSelect,
  onSearch,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

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
      const center: [number, number] = [2.3522, 48.8566];
      const results = await enhancedGeocodingService.searchPlaces(query, center, {
        limit: 5,
        radius: 50,
        language: 'fr'
      });
      
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setOpen(false);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    
    onLocationSelect({
      name: suggestion.name,
      coordinates: suggestion.coordinates,
      placeName: suggestion.address
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white justify-start text-left"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="text-gray-500">Rechercher un lieu...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechercher un lieu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Restaurant, hôtel, adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
              )}
            </div>
            <Button type="submit" disabled={isLoading} size="sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "OK"}
            </Button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPopup;
