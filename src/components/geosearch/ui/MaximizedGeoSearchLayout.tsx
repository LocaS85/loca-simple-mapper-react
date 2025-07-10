import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, ArrowLeft, MapPin, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import SmartBreadcrumb from './SmartBreadcrumb';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import EnhancedLocationButton from '../EnhancedLocationButton';
import GeoSearchMap from './GeoSearchMap';
import LocationDetailsPopup from './LocationDetailsPopup';
import GeoSearchFiltersSheet from './GeoSearchFiltersSheet';
import HorizontalCategoryBar from './HorizontalCategoryBar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';
import { useCategorySync } from '@/hooks/useCategorySync';

interface MaximizedGeoSearchLayoutProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  userLocation: [number, number] | null;
  isLoading: boolean;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onBack: () => void;
}

const MaximizedGeoSearchLayout: React.FC<MaximizedGeoSearchLayoutProps> = ({
  filters,
  results,
  userLocation,
  isLoading,
  onSearch,
  onLocationSelect,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  onBack
}) => {
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  
  // Synchronisation avec les catégories
  const { navigateToCategories, updateFilters, performSearch } = useCategorySync();

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5;

  const handleResultSelect = (result: SearchResult) => {
    setSelectedLocation(result);
    onLocationSelect({
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address || result.name
    });
  };

  // Gestion des catégories Google Maps style
  const handleCategorySelect = (categoryId: string) => {
    console.log('🏷️ Catégorie sélectionnée:', categoryId);
    
    // Mettre à jour les filtres avec la nouvelle catégorie
    const currentCategories = filters.category ? filters.category.split(',') : [];
    const newCategories = [...currentCategories, categoryId];
    
    const newFilters = {
      ...filters,
      category: newCategories.join(','),
      query: categoryId // Utiliser la catégorie comme query
    };
    
    onFiltersChange(newFilters);
    
    // Déclencher une recherche automatique
    setTimeout(() => {
      onSearch(categoryId);
    }, 100);
  };

  const handleCategoryRemove = (categoryId: string) => {
    console.log('🗑️ Catégorie supprimée:', categoryId);
    
    const currentCategories = filters.category ? filters.category.split(',') : [];
    const newCategories = currentCategories.filter(cat => cat !== categoryId);
    
    const newFilters = {
      ...filters,
      category: newCategories.length > 0 ? newCategories.join(',') : ''
    };
    
    onFiltersChange(newFilters);
    
    // Recherche mise à jour
    if (newCategories.length > 0) {
      onSearch(newCategories[0]);
    }
  };

  const handleClearAllCategories = () => {
    console.log('🧹 Effacement de toutes les catégories');
    onResetFilters();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header ultra-minimal collapsible */}
      <div 
        className={`
          bg-white/95 backdrop-blur-md border-b border-white/20 shadow-sm z-50 
          transition-all duration-300 relative
          ${isHeaderCollapsed ? 'h-14' : isMobile ? 'h-32' : 'h-24'}
        `}
      >
        {!isHeaderCollapsed ? (
          // Header complet
          <div className="p-4 space-y-3">
            {/* Ligne 1: Navigation et actions rapides */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SmartBreadcrumb />
                
                {userLocation && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    Position détectée
                  </Badge>
                )}

                <Badge variant="outline" className="text-xs">
                  {results.length} résultats
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* Actions mobiles */}
                {isMobile && (
                  <>
                    {results.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResults(true)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant={hasActiveFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ligne 2: Recherche (desktop) ou cachée (mobile) */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-md">
                  <EnhancedSearchBar
                    value={filters.query || ''}
                    onSearch={onSearch}
                    onLocationSelect={onLocationSelect}
                    placeholder="Rechercher dans cette zone..."
                    className="w-full border-gray-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <EnhancedLocationButton
                  onLocationDetected={onMyLocationClick}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetFilters}
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Header collapsed - version ultra-minimaliste
          <div className="p-3 flex items-center justify-between">
            <SmartBreadcrumb />
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {results.length}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHeaderCollapsed(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Barre horizontale de catégories Google Maps */}
      <HorizontalCategoryBar
        filters={filters}
        onCategorySelect={handleCategorySelect}
        onCategoryRemove={handleCategoryRemove}
        onClearAll={handleClearAllCategories}
        isLoading={isLoading}
      />

      {/* Carte maximisée */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <GeoSearchMap
            results={results}
            userLocation={userLocation}
            transport={filters.transport}
            category={filters.category}
          />
        </div>

        {/* Contrôles flottants mobiles */}
        {isMobile && !isHeaderCollapsed && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <EnhancedSearchBar
              value={filters.query || ''}
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
              placeholder="Rechercher ici..."
              className="w-full bg-white/95 backdrop-blur-md border border-white/20 shadow-lg"
            />
          </div>
        )}

        {/* Panel flottant résultats mobile */}
        {isMobile && results.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{results.length} résultats</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResults(true)}
                >
                  Voir tout
                </Button>
              </div>
              
              {results.slice(0, 2).map((result, index) => (
                <div
                  key={result.id}
                  className="py-2 cursor-pointer hover:bg-gray-50 rounded"
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="font-medium text-sm">{result.name}</div>
                  <div className="text-xs text-gray-500">{result.address}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popups et sheets */}
      <LocationDetailsPopup
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNavigate={(coords) => {
          // Implémenter la navigation
          console.log('Navigate to:', coords);
        }}
      />

      <GeoSearchFiltersSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
      />

      {/* Sheet résultats mobile */}
      {isMobile && (
        <Sheet open={showResults} onOpenChange={setShowResults}>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Résultats ({results.length})</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 h-full">
              <div className="p-4">
                <EnhancedResultsList
                  results={results}
                  isLoading={isLoading}
                  onResultClick={handleResultSelect}
                />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default MaximizedGeoSearchLayout;