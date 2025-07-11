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
  Download,
  Timer
} from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { useIsMobile } from '@/hooks/use-mobile';
import GoogleMapsTransportSelector from './GoogleMapsTransportSelector';
import GoogleMapsCategorySelector from './GoogleMapsCategorySelector';
import GoogleMapsDistanceSelector from './GoogleMapsDistanceSelector';
import DurationSelector from './DurationSelector';
import ExportPDFButton from './ExportPDFButton';
import { unifiedCategories } from '@/data/unifiedCategories';

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
  onCategoryClick?: (categoryId: string) => void;
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
  results = [],
  onCategoryClick
}) => {
  const isMobile = useIsMobile();

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5 ||
    filters.unit !== 'km';

  // Fonction pour obtenir les sous-catégories dans la sidebar
  const getSubcategoriesForSidebar = (mainCategoryId: string) => {
    const category = unifiedCategories.find(cat => cat.id === mainCategoryId);
    if (category && category.subcategories) {
      return category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        mainCategory: mainCategoryId
      }));
    }
    
    // Fallback mock data
    const mockSubcategories: Record<string, Array<{id: string, name: string, mainCategory: string}>> = {
      restaurant: [
        { id: 'fast-food', name: 'Fast Food', mainCategory: 'restaurant' },
        { id: 'fine-dining', name: 'Fine Dining', mainCategory: 'restaurant' },
        { id: 'cafes', name: 'Cafés', mainCategory: 'restaurant' }
      ],
      health: [
        { id: 'pharmacy', name: 'Pharmacie', mainCategory: 'health' },
        { id: 'hospital', name: 'Hôpital', mainCategory: 'health' },
        { id: 'doctor', name: 'Médecin', mainCategory: 'health' }
      ],
      shopping: [
        { id: 'supermarket', name: 'Supermarché', mainCategory: 'shopping' },
        { id: 'clothing', name: 'Vêtements', mainCategory: 'shopping' }
      ]
    };
    
    return mockSubcategories[mainCategoryId] || [];
  };

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

      {/* Sidebar - POSITIONNÉE À DROITE */}
      <div className={`
        ${isMobile ? 'fixed right-0 top-0 h-full z-50' : 'relative'}
        bg-white border-l border-gray-200 shadow-lg transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isMobile ? 'w-72' : 'w-64'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header - Optimisé */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Filtres</h2>
              
              <div className="flex items-center gap-1">
                {hasActiveFilters && (
                  <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                    Actifs
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  disabled={!hasActiveFilters || isLoading}
                  className="text-gray-600 hover:text-gray-900 h-6 w-6 p-0"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu scrollable - Optimisé */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {/* Position utilisateur - Optimisé */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Position
                </h3>
                
                <Button
                  variant={userLocation ? "outline" : "default"}
                  size="sm"
                  onClick={onMyLocationClick}
                  disabled={isLoading}
                  className="w-full justify-between h-8 text-xs"
                >
                  <span>
                    {userLocation ? 'Position détectée' : 'Détecter ma position'}
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <Separator />

              {/* Sélecteur de transport - Optimisé */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <Route className="h-3 w-3" />
                  Transport
                </h3>
                
                <GoogleMapsTransportSelector
                  value={filters.transport}
                  onChange={(transport) => onFiltersChange({ transport: transport as any })}
                />
              </div>

              <Separator />

              {/* Distance - Optimisé */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Distance max.
                </h3>
                
                <GoogleMapsDistanceSelector
                  value={filters.distance}
                  onChange={(distance) => onFiltersChange({ distance })}
                  unit={filters.unit || 'km'}
                  onUnitChange={(unit) => onFiltersChange({ unit })}
                />
              </div>

              <Separator />

              {/* Distance en durée - Optimisé */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <Timer className="h-3 w-3" />
                  Durée max.
                </h3>
                
                <DurationSelector
                  value={filters.maxDuration || 20}
                  onChange={(maxDuration) => onFiltersChange({ maxDuration })}
                />
              </div>

              <Separator />

              {/* Catégories avec sous-catégories */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3 w-3" />
                  Catégories
                </h3>
                
                <GoogleMapsCategorySelector
                  selectedCategories={Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []}
                  onChange={(categories) => {
                    onFiltersChange({ category: categories.length > 0 ? categories : undefined });
                    // Déclencher l'affichage des sous-catégories si une catégorie est sélectionnée
                    if (categories.length > 0 && onCategoryClick) {
                      onCategoryClick(categories[categories.length - 1]);
                    }
                  }}
                />
                
                {/* Sous-catégories intégrées dans la sidebar */}
                {filters.selectedMainCategory && (
                  <div className="mt-2 pl-2 border-l-2 border-blue-200">
                    <h4 className="text-xs font-medium text-blue-700 mb-1">Sous-catégories</h4>
                    <div className="flex flex-col gap-1">
                      {getSubcategoriesForSidebar(filters.selectedMainCategory).map(subcategory => (
                        <Button
                          key={subcategory.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => onFiltersChange({ 
                            category: [...(Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []), subcategory.id]
                          })}
                          className="h-6 px-2 text-xs justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          {subcategory.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export PDF - Desktop uniquement - Optimisé */}
              {!isMobile && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                      <Download className="h-3 w-3" />
                      Export
                    </h3>
                    
                    <ExportPDFButton
                      results={results}
                      userLocation={userLocation}
                      filters={{
                        query: filters.query,
                        category: Array.isArray(filters.category) ? filters.category[0] : filters.category,
                        distance: filters.distance,
                        transport: filters.transport
                      }}
                      size="sm"
                      className="w-full h-8 text-xs"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer mobile - Optimisé */}
          {isMobile && (
            <div className="p-3 border-t border-gray-200">
              <Button
                onClick={onToggle}
                className="w-full h-8 text-sm"
                size="sm"
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