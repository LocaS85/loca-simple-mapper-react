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
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>


          {/* Barre de recherche - Responsive */}
          <div className="flex-1 max-w-xs md:max-w-lg">
            <EnhancedSearchBar
              value={searchQuery}
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
              placeholder="Rechercher un lieu..."
              className="w-full text-sm"
            />
          </div>

          {/* Menu burger pour sidebar - DÉPLACÉ À DROITE */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className={`text-gray-600 hover:text-gray-900 ${showSidebar ? 'bg-gray-100' : ''}`}
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Indicateurs de statut */}
          <div className="flex items-center gap-1">
            {userLocation && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                <MapPin className="h-2.5 w-2.5 mr-1" />
                Position
              </Badge>
            )}

            {resultsCount > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {resultsCount}
              </Badge>
            )}

            {isLoading && (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsHeader;