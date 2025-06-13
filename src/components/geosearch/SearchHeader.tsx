import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Locate } from 'lucide-react';
import { TransportMode } from '@/types/map';
import { useDebounce } from '@/hooks/use-debounce';
import { EnhancedLocationButton, IntegratedSearchBar } from '@/components/map';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onLocationUpdate?: (coordinates: [number, number]) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  resultCount?: number;
  isLoading?: boolean;
  userLocation?: [number, number];
  className?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  onSearch,
  onLocationUpdate,
  showFilters,
  onToggleFilters,
  filters,
  onFiltersChange,
  resultCount = 0,
  isLoading = false,
  userLocation,
  className = ''
}) => {
  const [tempFilters, setTempFilters] = useState(filters);
  const debouncedFilters = useDebounce(tempFilters, 500);

  const handleApplyFilters = () => {
    onFiltersChange(debouncedFilters);
    onToggleFilters();
  };

  const handleLocationDetected = (coordinates: [number, number]) => {
    console.log('📍 Location detected:', coordinates);
    if (onLocationUpdate) {
      onLocationUpdate(coordinates);
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-sm text-gray-600">
          {isLoading ? (
            'Recherche en cours...'
          ) : (
            <>
              {resultCount} résultat{resultCount !== 1 ? 's' : ''}
            </>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1">
            <IntegratedSearchBar
              query={query}
              onQueryChange={onQueryChange}
              onSearch={onSearch}
              proximity={userLocation}
              className="w-full"
              placeholder="Rechercher un lieu..."
            />
          </div>

          {/* Location Button */}
          <EnhancedLocationButton
            onLocationDetected={handleLocationDetected}
            variant="outline"
            size="sm"
            className="shrink-0"
          />

          {/* Filters Button */}
          <Popover open={showFilters} onOpenChange={onToggleFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-3">
                {/* Transport Mode */}
                <div>
                  <label htmlFor="transport-mode" className="block text-sm font-medium leading-6 text-gray-900">
                    Mode de transport
                  </label>
                  <Select
                    value={tempFilters.transportMode}
                    onValueChange={(value) => setTempFilters({ ...tempFilters, transportMode: value as TransportMode })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driving">Voiture</SelectItem>
                      <SelectItem value="walking">À pied</SelectItem>
                      <SelectItem value="cycling">Vélo</SelectItem>
                      <SelectItem value="transit">Transport en commun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance Slider */}
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium leading-6 text-gray-900">
                    Distance maximale (km)
                  </label>
                  <Slider
                    defaultValue={[tempFilters.maxDistance]}
                    max={50}
                    step={1}
                    onValueChange={(value) => setTempFilters({ ...tempFilters, maxDistance: value[0] })}
                  />
                  <p className="text-sm text-gray-500">Valeur: {tempFilters.maxDistance} km</p>
                </div>

                {/* Apply Filters Button */}
                <Button onClick={handleApplyFilters} className="w-full">
                  Appliquer les filtres
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Display Filters (Optional) */}
      </div>
    </div>
  );
};

export default SearchHeader;
