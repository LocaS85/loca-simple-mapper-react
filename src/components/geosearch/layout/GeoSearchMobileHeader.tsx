
import React from "react";
import EnhancedLocationButton from "../EnhancedLocationButton";
import EnhancedSearchBar from "../../enhanced/EnhancedSearchBar";
import FiltersFloatingButton from "../FiltersFloatingButton";
import PrintButton from "../PrintButton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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
  <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
    <div className="p-3 space-y-3">
      {/* Ligne 1: Menu burger */}
      <div className="flex items-center justify-between">
        <button
          className="w-10 h-10 bg-white shadow-md border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          onClick={() => setShowSidebarPopup(true)}
        >
          <div className="w-4 h-4 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
            <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
            <div className="w-full h-0.5 bg-gray-700 rounded-full"></div>
          </div>
        </button>
        <div className="text-sm font-medium text-gray-600">
          GeoSearch
        </div>
        <div className="w-10 h-10" />
      </div>
      {/* Ligne 2: Ma position */}
      <div className="flex justify-center">
        <EnhancedLocationButton
          onLocationDetected={handleMyLocationClick}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-auto px-4"
        />
      </div>
      {/* Ligne 3: Barre de recherche */}
      <EnhancedSearchBar
        value={filters.query || ''}
        onSearch={handleSearch}
        onLocationSelect={handleLocationSelect}
        isLoading={isLoading}
        placeholder="Rechercher un lieu..."
        className="w-full"
      />
      {/* Ligne 4: Filtres et contrôle navigation */}
      <div className="flex items-center justify-center gap-2">
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
          className="px-3"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <PrintButton results={results} />
      </div>
    </div>
  </div>
);

export default GeoSearchMobileHeader;
