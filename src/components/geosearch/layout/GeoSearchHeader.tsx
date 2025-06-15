
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import AutoSuggestSearch from '../AutoSuggestSearch';
import EnhancedLocationButton from '../EnhancedLocationButton';

interface GeoSearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  userLocation: [number, number] | null;
  isLoading: boolean;
  onMyLocationClick: () => void;
}

const GeoSearchHeader: React.FC<GeoSearchHeaderProps> = ({
  searchQuery,
  onSearch,
  onLocationSelect,
  userLocation,
  isLoading,
  onMyLocationClick
}) => {
  return (
    <Card className="mb-6 shadow-sm border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Recherche Géographique
            </h1>
            <p className="text-gray-600 mt-1">
              Trouvez des lieux et services près de vous
            </p>
          </div>
          
          {userLocation && (
            <Badge variant="outline" className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Position détectée
            </Badge>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <AutoSuggestSearch
              onResultSelect={(result) => onLocationSelect({
                name: result.name || result.place_name,
                coordinates: result.center,
                placeName: result.place_name
              })}
              placeholder="Rechercher des lieux, restaurants, services..."
              initialValue={searchQuery}
              showMyLocationButton={false}
              className="w-full"
            />
          </div>
          
          <EnhancedLocationButton
            onLocationDetected={onMyLocationClick}
            disabled={isLoading}
            variant="outline"
            className="shrink-0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeoSearchHeader;
