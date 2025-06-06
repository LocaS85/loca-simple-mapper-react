
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';
import FloatingControls from '../FloatingControls';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';

interface GeoSearchSidebarProps {
  filters: GeoSearchFilters;
  userLocation: [number, number] | null;
  results: SearchResult[];
  isLoading: boolean;
  statusInfo: {
    hasResults: boolean;
    totalResults: number;
  };
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onSearch: (query: string) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
}

export const GeoSearchSidebar: React.FC<GeoSearchSidebarProps> = ({
  filters,
  userLocation,
  results,
  isLoading,
  statusInfo,
  onLocationSelect,
  onSearch,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters
}) => {
  return (
    <div className="w-80 lg:w-96 xl:w-[400px] bg-white border-r shadow-sm flex flex-col flex-shrink-0">
      {/* Search controls */}
      <Card className="m-3 lg:m-4 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <Search className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
            Recherche géographique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 lg:space-y-4">
          <FloatingControls
            filters={filters}
            onLocationSelect={onLocationSelect}
            onSearch={onSearch}
            onMyLocationClick={onMyLocationClick}
            onFiltersChange={onFiltersChange}
            onResetFilters={onResetFilters}
            isLoading={isLoading}
          />
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground truncate">
                {isLoading ? 'Recherche...' : statusInfo.hasResults ? 
                  `${statusInfo.totalResults} résultat${statusInfo.totalResults > 1 ? 's' : ''}` : 'Prêt'}
              </span>
            </div>
            {userLocation && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Position OK
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results section */}
      <div className="flex-1 overflow-hidden mx-3 lg:mx-4 mb-3 lg:mb-4">
        {statusInfo.hasResults ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-sm lg:text-base flex items-center justify-between">
                <span>Résultats de recherche</span>
                <Badge variant="secondary" className="text-xs">
                  {statusInfo.totalResults}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-full">
                <EnhancedResultsList
                  results={results}
                  isLoading={isLoading}
                  onNavigate={(coords) => {
                    console.log('Navigate to:', coords);
                  }}
                  className="px-4 lg:px-6"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center p-4 lg:p-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400" />
                </div>
                <h3 className="font-medium mb-2 text-gray-900 text-sm lg:text-base">
                  Prêt à rechercher
                </h3>
                <p className="text-xs lg:text-sm text-gray-500 max-w-xs">
                  Saisissez un terme de recherche ou sélectionnez une catégorie pour commencer
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
