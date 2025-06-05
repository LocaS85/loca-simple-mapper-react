
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeoSearchFilters } from '@/types/geosearch';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLocationDetected = (coordinates: [number, number]) => {
    console.log('📍 Nouvelle position détectée dans SearchHeader:', coordinates);
    onMyLocationClick(coordinates);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center gap-3 p-4">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un lieu, restaurant, hôtel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
              disabled={isLoading}
            />
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

        {/* Bouton Ma Position amélioré */}
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
