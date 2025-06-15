
import React from "react";
import EnhancedLocationButton from "../EnhancedLocationButton";
import EnhancedSearchBar from "../../enhanced/EnhancedSearchBar";
import FiltersFloatingButton from "../FiltersFloatingButton";
import PrintButton from "../PrintButton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface GeoSearchDesktopHeaderProps {
  isLoading: boolean;
  filters: any;
  results: any[];
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
  handleMyLocationClick: () => void;
  handleSearch: (query?: string) => void;
  handleLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  setShowSidebarPopup: (show: boolean) => void;
}

const GeoSearchDesktopHeader: React.FC<GeoSearchDesktopHeaderProps> = ({
  isLoading,
  filters,
  results,
  updateFilters,
  resetFilters,
  handleMyLocationClick,
  handleSearch,
  handleLocationSelect,
  setShowSidebarPopup,
}) => (
  <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
    <div className="p-4 max-w-4xl mx-auto space-y-3">
      {/* Ligne 1: Menu et titre */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <h1 className="text-lg font-semibold text-gray-900">
            Recherche géographique
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {results.length} résultat{results.length > 1 ? 's' : ''}
        </div>
      </div>
      {/* Ligne 2: Ma position */}
      <div className="flex justify-center">
        <EnhancedLocationButton
          onLocationDetected={handleMyLocationClick}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-auto px-6"
        />
      </div>
      {/* Ligne 3: Barre de recherche principale */}
      <div className="max-w-2xl mx-auto">
        <EnhancedSearchBar
          value={filters.query || ''}
          onSearch={handleSearch}
          onLocationSelect={handleLocationSelect}
          isLoading={isLoading}
          placeholder="Rechercher un lieu, un type d'établissement..."
          className="w-full"
        />
      </div>
      {/* Ligne 4: Contrôles */}
      <div className="flex items-center justify-center gap-3">
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

export default GeoSearchDesktopHeader;
