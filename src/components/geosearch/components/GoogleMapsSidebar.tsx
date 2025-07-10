import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  Clock, 
  Route,
  Car,
  PersonStanding,
  Bike,
  Bus,
  ChevronRight,
  Download
} from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { useIsMobile } from '@/hooks/use-mobile';
import GoogleMapsTransportSelector from './GoogleMapsTransportSelector';
import GoogleMapsCategorySelector from './GoogleMapsCategorySelector';
import GoogleMapsDistanceSelector from './GoogleMapsDistanceSelector';
import ExportPDFButton from './ExportPDFButton';

interface GoogleMapsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  userLocation: [number, number] | null;
  onMyLocationClick: () => void;
  isLoading: boolean;
  results?: SearchResult[];
}

const GoogleMapsSidebar: React.FC<GoogleMapsSidebarProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onResetFilters,
  userLocation,
  onMyLocationClick,
  isLoading,
  results = []
}) => {
  const isMobile = useIsMobile();

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5;

  if (!isOpen && !isMobile) return null;

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
        bg-white border-r border-gray-200 shadow-lg transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'w-80' : 'w-72'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="destructive" className="px-2 py-1 text-xs">
                    Actifs
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  disabled={!hasActiveFilters || isLoading}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Position utilisateur */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Position
                </h3>
                
                <Button
                  variant={userLocation ? "outline" : "default"}
                  size="sm"
                  onClick={onMyLocationClick}
                  disabled={isLoading}
                  className="w-full justify-between"
                >
                  <span>
                    {userLocation ? 'Position détectée' : 'Détecter ma position'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              {/* Sélecteur de transport */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Mode de transport
                </h3>
                
                <GoogleMapsTransportSelector
                  value={filters.transport}
                  onChange={(transport) => onFiltersChange({ transport: transport as any })}
                />
              </div>

              <Separator />

              {/* Distance */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Distance maximale
                </h3>
                
                <GoogleMapsDistanceSelector
                  value={filters.distance}
                  onChange={(distance) => onFiltersChange({ distance })}
                />
              </div>

              <Separator />

              {/* Catégories */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Catégories
                </h3>
                
                <GoogleMapsCategorySelector
                  selectedCategories={filters.category ? filters.category.split(',') : []}
                  onChange={(categories) => onFiltersChange({ category: categories.join(',') })}
                />
              </div>

              {/* Export PDF - Desktop uniquement */}
              {!isMobile && (
                <>
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </h3>
                    
                    <ExportPDFButton
                      results={results}
                      userLocation={userLocation}
                      filters={{
                        query: filters.query,
                        category: filters.category,
                        distance: filters.distance,
                        transport: filters.transport
                      }}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer mobile */}
          {isMobile && (
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={onToggle}
                className="w-full"
                size="lg"
              >
                Appliquer les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GoogleMapsSidebar;