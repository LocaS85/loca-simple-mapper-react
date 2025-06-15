
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';
import MapboxMap from '../../MapboxMap';
import GeoSearchFiltersPanel from '../filters/GeoSearchFiltersPanel';

interface GeoSearchContentProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  userLocation: [number, number] | null;
  networkStatus: 'online' | 'offline' | 'slow';
  statusInfo: {
    totalResults: number;
    hasResults: boolean;
    isReady: boolean;
  };
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onTransportChange: (transport: TransportMode) => void;
  onClearCache: () => void;
}

const GeoSearchContent: React.FC<GeoSearchContentProps> = ({
  filters,
  results,
  isLoading,
  userLocation,
  networkStatus,
  statusInfo,
  onFiltersChange,
  onLocationSelect,
  onTransportChange,
  onClearCache
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Filters Panel */}
      <div className="lg:col-span-3">
        <GeoSearchFiltersPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onTransportChange={onTransportChange}
          onClearCache={onClearCache}
          isLoading={isLoading}
        />
      </div>

      {/* Results List */}
      <div className="lg:col-span-4">
        <Card className="h-full">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Résultats ({results.length})
              </h3>
              {networkStatus !== 'online' && (
                <p className="text-sm text-amber-600 mt-1">
                  {networkStatus === 'offline' ? 'Mode hors ligne' : 'Connexion lente'}
                </p>
              )}
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
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
                userLocation={userLocation}
                transportMode={filters.transport}
                className="border-0 shadow-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <div className="lg:col-span-5">
        <Card className="h-full">
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapboxMap
                results={results}
                transport={filters.transport}
                radius={filters.distance}
                category={filters.category}
                className="w-full h-full border-0 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeoSearchContent;
