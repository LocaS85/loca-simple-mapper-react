
import React from "react";
import EnhancedLocationButton from "../EnhancedLocationButton";
import EnhancedSearchBar from "../../enhanced/EnhancedSearchBar";
import FiltersFloatingButton from "../FiltersFloatingButton";
import PrintButton from "../PrintButton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { GeoSearchFilters, SearchResult } from "@/types/geosearch";

interface LocationSelectData {
  name: string;
  coordinates: [number, number];
  placeName: string;
}

interface GeoSearchDesktopHeaderProps {
  isLoading: boolean;
  filters: GeoSearchFilters;
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
  results: SearchResult[];
  handleMyLocationClick: () => void;
  handleSearch: (query?: string) => void;
  handleLocationSelect: (location: LocationSelectData) => void;
}

const GeoSearchDesktopHeader: React.FC<GeoSearchDesktopHeaderProps> = ({
  isLoading,
  filters,
  updateFilters,
  resetFilters,
  results,
  handleMyLocationClick,
  handleSearch,
  handleLocationSelect,
}) => (
  <div className="hidden md:flex items-center justify-between gap-4 p-4 bg-white/95 backdrop-blur-sm border-b">
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 max-w-md">
        <EnhancedSearchBar
          value={filters.query || ''}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          placeholder="Rechercher un lieu..."
          className="w-full"
          isLoading={isLoading}
        />
      </div>
      
      <EnhancedLocationButton
        onLocationDetected={handleMyLocationClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
      />
    </div>

    <div className="flex items-center gap-2">
      <FiltersFloatingButton
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        isLoading={isLoading}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        disabled={isLoading}
        title="Réinitialiser les filtres"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <PrintButton results={results} />
    </div>
  </div>
);

export default GeoSearchDesktopHeader;
