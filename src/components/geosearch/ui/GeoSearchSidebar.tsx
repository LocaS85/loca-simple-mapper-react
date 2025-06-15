
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MapPin, Settings } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
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
  };
  onSearch: (query: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onClose: () => void;
  isMobile: boolean;
}

const GeoSearchSidebar: React.FC<GeoSearchSidebarProps> = ({
  filters,
  results,
  userLocation,
  isLoading,
  statusInfo,
  onLocationSelect,
  onClose,
  isMobile
}) => {
  return (
    <div className="h-full bg-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            Résultats de recherche
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {statusInfo.totalResults}
            </Badge>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Position status */}
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <MapPin className="h-4 w-4" />
            <span>Position détectée</span>
          </div>
        )}
      </div>

      {/* Filtres actifs */}
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

      {/* Liste des résultats */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <EnhancedResultsList
              results={results}
              isLoading={isLoading}
              onResultClick={(result) => {
                onLocationSelect({
                  name: result.name,
                  coordinates: result.coordinates,
                  placeName: result.address || result.name
                });
              }}
              className="border-0 shadow-none"
            />
          </div>
        </ScrollArea>
      </div>

      {/* Footer status */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-center">
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
