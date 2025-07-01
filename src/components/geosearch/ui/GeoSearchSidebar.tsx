
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Settings, RotateCcw } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import EnhancedLocationButton from '../EnhancedLocationButton';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';

interface GeoSearchSidebarProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  userLocation: [number, number] | null;
  isLoading: boolean;
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
    isReady: boolean;
    canSearch: boolean;
  };
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onClose?: () => void;
  isMobile: boolean;
}

const GeoSearchSidebar: React.FC<GeoSearchSidebarProps> = ({
  filters,
  results,
  userLocation,
  isLoading,
  statusInfo,
  onSearch,
  onLocationSelect,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  onClose,
  isMobile
}) => {
  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5;

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'border-r'} shadow-sm flex flex-col`}>
      {/* Header avec recherche */}
      <div className="p-4 border-b bg-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">
            Recherche géographique
          </h1>
          {isMobile && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          {userLocation && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Position OK
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {statusInfo.totalResults} résultats
          </Badge>
        </div>

        {/* Barre de recherche */}
        <div className="space-y-2">
          <EnhancedSearchBar
            value={filters.query || ''}
            onSearch={onSearch}
            onLocationSelect={onLocationSelect}
            placeholder="Rechercher des lieux..."
            className="w-full"
          />
          
          <div className="flex gap-2">
            <EnhancedLocationButton
              onLocationDetected={onMyLocationClick}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex-1"
            />
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
        </div>
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="p-4 bg-blue-50/50 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Filtres actifs</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="text-xs">
                📍 {filters.category}
              </Badge>
            )}
            {filters.transport !== 'walking' && (
              <Badge variant="secondary" className="text-xs">
                🚶 {filters.transport}
              </Badge>
            )}
            {filters.distance !== 10 && (
              <Badge variant="secondary" className="text-xs">
                📏 {filters.distance} {filters.unit}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Section résultats */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">
            Résultats de recherche
          </h3>
        </div>
        
        <ScrollArea className="flex-1 h-full">
          <div className="p-4">
            <EnhancedResultsList
              results={results}
              isLoading={isLoading}
              onNavigate={(result) => {
                onLocationSelect({
                  name: result.name,
                  coordinates: result.coordinates,
                  placeName: result.address || result.name
                });
              }}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Footer status */}
      <div className="p-4 border-t bg-gray-50/50">
        <div className="text-xs text-gray-600 text-center">
          {statusInfo.isReady ? (
            <span className="text-green-600">✓ Prêt pour la recherche</span>
          ) : (
            <span className="text-orange-600">⏳ Initialisation...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoSearchSidebar;
