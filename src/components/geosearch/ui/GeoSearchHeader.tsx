
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, MapPin, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import EnhancedLocationButton from '../EnhancedLocationButton';
import GeoSearchFiltersSheet from './GeoSearchFiltersSheet';

interface GeoSearchHeaderProps {
  filters: GeoSearchFilters;
  isLoading: boolean;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
    isReady: boolean;
  };
}

const GeoSearchHeader: React.FC<GeoSearchHeaderProps> = ({
  filters,
  isLoading,
  onSearch,
  onLocationSelect,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  onToggleSidebar,
  isMobile,
  statusInfo
}) => {
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  
  // Vérifier si des filtres sont actifs
  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5;
  return (
    <>
      <div className="bg-white border-b shadow-sm">
        <div className="p-4">
          {/* Ligne principale avec burger et titre */}
          {!isMobile && (
            <div className="flex items-center gap-3 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSidebar}
                className="shrink-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              {statusInfo.isReady && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {statusInfo.totalResults} résultats
                </Badge>
              )}
            </div>
          )}

          {/* Barre de recherche */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <EnhancedSearchBar
                value={filters.query || ''}
                onSearch={onSearch}
                onLocationSelect={onLocationSelect}
                placeholder="Rechercher des lieux, restaurants..."
                className="w-full"
              />
            </div>
          </div>

          {/* Contrôles : Position + Filtres + Actions */}
          <div className="flex items-center justify-between gap-3">
            {/* Bouton Ma position */}
            <EnhancedLocationButton
              onLocationDetected={onMyLocationClick}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="shrink-0"
            />

            {/* Actions centrales */}
            <div className="flex items-center gap-2">
              {/* Bouton Filtres avec indicateur */}
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFiltersSheet(true)}
                className="relative"
                disabled={isLoading}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                )}
              </Button>
              
              {/* Bouton reset */}
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                disabled={isLoading}
                className="px-3"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile: Menu burger */}
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSidebar}
                className="shrink-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Badge résultats mobile */}
          {isMobile && statusInfo.isReady && (
            <div className="flex justify-center mt-3">
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {statusInfo.totalResults} résultats trouvés
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Sheet latéral pour les filtres */}
      <GeoSearchFiltersSheet
        open={showFiltersSheet}
        onClose={() => setShowFiltersSheet(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
      />
    </>
  );
};

export default GeoSearchHeader;
