
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Settings, RotateCcw } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';
import EnhancedLocationButton from '../EnhancedLocationButton';

interface GeoSearchSidebarPopupProps {
  filters: GeoSearchFilters;
  userLocation: [number, number] | null;
  results: SearchResult[];
  isLoading: boolean;
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
    isReady: boolean;
  };
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query: string) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GeoSearchSidebarPopup: React.FC<GeoSearchSidebarPopupProps> = ({
  filters,
  userLocation,
  results,
  isLoading,
  statusInfo,
  onLocationSelect,
  onSearch,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  open,
  onOpenChange
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 lg:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <SheetTitle className="text-lg font-semibold text-gray-900">
                Recherche géographique
              </SheetTitle>
              {userLocation && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Position OK
                </Badge>
              )}
            </div>
            
            {/* Search bar */}
            <div className="space-y-2">
              <EnhancedSearchBar
                value={filters.query || ''}
                onSearch={onSearch}
                onLocationSelect={onLocationSelect}
                isLoading={isLoading}
                placeholder="Rechercher des lieux..."
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
                  className="px-3"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Active filters */}
          {(filters.category || filters.transport !== 'walking' || filters.distance !== 10) && (
            <div className="p-4 bg-blue-50 border-b">
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

          {/* Results section */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  Résultats
                </h3>
                <Badge variant="outline" className="text-xs">
                  {statusInfo.totalResults}
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 h-full">
              <div className="p-4">
                <EnhancedResultsList
                  results={results}
                  isLoading={isLoading}
                  onNavigate={(coords) => {
                    console.log('Navigate to:', coords);
                  }}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Status footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="text-xs text-gray-600 text-center">
              {statusInfo.isReady ? (
                <span className="text-green-600">✓ Prêt pour la recherche</span>
              ) : (
                <span className="text-orange-600">⏳ Initialisation...</span>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
