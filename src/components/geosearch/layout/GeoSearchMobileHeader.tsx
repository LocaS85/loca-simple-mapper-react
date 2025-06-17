
import React from "react";
import EnhancedLocationButton from "../EnhancedLocationButton";
import EnhancedSearchBar from "../../enhanced/EnhancedSearchBar";
import FiltersFloatingButton from "../FiltersFloatingButton";
import PrintButton from "../PrintButton";
import { Button } from "@/components/ui/button";
import { RotateCcw, Menu } from "lucide-react";

interface GeoSearchMobileHeaderProps {
  isLoading: boolean;
  filters: any;
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
  results: any[];
  handleMyLocationClick: () => void;
  handleSearch: (query?: string) => void;
  handleLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  setShowSidebarPopup: (show: boolean) => void;
}

const GeoSearchMobileHeader: React.FC<GeoSearchMobileHeaderProps> = ({
  isLoading,
  filters,
  updateFilters,
  resetFilters,
  results,
  handleMyLocationClick,
  handleSearch,
  handleLocationSelect,
  setShowSidebarPopup,
}) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
    <div className="px-3 py-2 space-y-2">
      {/* Ligne 1: Menu burger et titre */}
      <div className="flex items-center justify-between h-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSidebarPopup(true)}
          className="h-8 w-8 p-0 bg-white shadow-sm border hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium text-gray-600 flex-1 text-center">
          GeoSearch
        </div>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      {/* Ligne 2: Filtres et navigation sous le menu */}
      <div className="flex items-center justify-start gap-2 px-1">
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
          className="h-7 w-7 p-0"
          disabled={isLoading}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
        <PrintButton results={results} />
      </div>
      
      {/* Ligne 3: Barre de recherche */}
      <div className="w-full">
        <EnhancedSearchBar
          value={filters.query || ''}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          placeholder="Rechercher un lieu..."
          className="w-full"
          isLoading={isLoading}
        />
      </div>
      
      {/* Ligne 4: Ma position centré */}
      <div className="flex justify-center py-1">
        <EnhancedLocationButton
          onLocationDetected={handleMyLocationClick}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="px-3 h-8 text-xs"
        />
      </div>
    </div>
  </div>
);

export default GeoSearchMobileHeader;
