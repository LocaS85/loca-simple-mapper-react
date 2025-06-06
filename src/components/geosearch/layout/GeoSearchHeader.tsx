
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';

interface GeoSearchHeaderProps {
  filters: GeoSearchFilters;
  userLocation: [number, number] | null;
  isLoading: boolean;
  networkStatus: string;
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
  };
}

export const GeoSearchHeader: React.FC<GeoSearchHeaderProps> = ({
  filters,
  userLocation,
  isLoading,
  networkStatus,
  statusInfo
}) => {
  // Status indicator component
  const StatusIndicator = () => (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      {networkStatus === 'online' ? (
        <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
      ) : (
        <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
      )}
      <span className="text-muted-foreground truncate">
        {isLoading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Recherche...
          </span>
        ) : statusInfo.hasResults ? (
          `${statusInfo.totalResults} résultat${statusInfo.totalResults > 1 ? 's' : ''}`
        ) : (
          'Prêt'
        )}
      </span>
    </div>
  );

  // Active filters display
  const ActiveFilters = () => {
    const hasActiveFilters = filters.category || filters.transport !== 'walking' || filters.distance !== 10;
    
    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-blue-50 rounded-lg overflow-hidden">
        {filters.category && (
          <Badge variant="secondary" className="text-xs truncate max-w-[120px]">
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
        {filters.maxDuration !== 20 && (
          <Badge variant="secondary" className="text-xs">
            ⏱️ {filters.maxDuration} min
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-b shadow-sm z-30 p-3 sm:p-4 flex-shrink-0">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <StatusIndicator />
          {userLocation && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Position OK
            </Badge>
          )}
        </div>
        <ActiveFilters />
      </div>
    </div>
  );
};
