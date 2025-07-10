import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Menu, MapPin, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';

interface GoogleMapsHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  userLocation: [number, number] | null;
  resultsCount: number;
  isLoading: boolean;
  onBack: () => void;
  onToggleSidebar: () => void;
  showSidebar: boolean;
}

const GoogleMapsHeader: React.FC<GoogleMapsHeaderProps> = ({
  searchQuery,
  onSearch,
  onLocationSelect,
  userLocation,
  resultsCount,
  isLoading,
  onBack,
  onToggleSidebar,
  showSidebar
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Menu burger pour sidebar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className={`text-gray-600 hover:text-gray-900 ${showSidebar ? 'bg-gray-100' : ''}`}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <EnhancedSearchBar
              value={searchQuery}
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
              placeholder="Rechercher un lieu..."
              className="w-full"
            />
          </div>

          {/* Indicateurs de statut */}
          <div className="flex items-center gap-2">
            {userLocation && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <MapPin className="h-3 w-3 mr-1" />
                Position
              </Badge>
            )}

            {resultsCount > 0 && (
              <Badge variant="outline">
                {resultsCount} résultats
              </Badge>
            )}

            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsHeader;