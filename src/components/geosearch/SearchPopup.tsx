
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';

interface SearchPopupProps {
  filters: GeoSearchFilters;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  filters,
  onLocationSelect,
  onSearch,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleQuickSearch = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher des lieux..."
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-10 pr-12 h-12 bg-white shadow-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-50" align="start">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher des lieux..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Button type="submit" className="w-full" disabled={!searchQuery.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
          </div>

          {/* Suggestions rapides */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2 text-gray-700">Suggestions</h4>
            <div className="space-y-1">
              {['Restaurants', 'Pharmacies', 'Stations essence', 'Banques', 'Supermarchés'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleQuickSearch(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default SearchPopup;
