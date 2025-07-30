import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight,
  Download,
  Timer,
  Hash
} from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterButton, AroundMeFilter, LoadingSkeleton } from '../atoms';
import { OptimizedTransportSelector } from '../performance';
import GoogleMapsCategorySelector from '../components/GoogleMapsCategorySelector';
import GoogleMapsDistanceSelector from '../components/GoogleMapsDistanceSelector';
import DurationSelector from '../components/DurationSelector';
import ExportPDFButton from '../components/ExportPDFButton';

interface ModernSidebarProps {
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
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  resultsCount?: number;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onResetFilters,
  userLocation,
  onMyLocationClick,
  isLoading,
  results = [],
  onCategoryClick,
  searchQuery = '',
  onSearchChange,
  resultsCount = 0
}) => {
  const isMobile = useIsMobile();

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10 ||
    filters.maxDuration !== 20 ||
    filters.aroundMeCount !== 5 ||
    filters.unit !== 'km';

  const sidebarVariants = {
    closed: {
      x: isMobile ? '100%' : 0,
      width: isMobile ? '320px' : '0px',
      opacity: isMobile ? 0 : 1,
    },
    open: {
      x: 0,
      width: isMobile ? '320px' : '192px', // w-80 mobile, w-48 desktop
      opacity: 1,
    }
  };

  const contentVariants = {
    closed: { opacity: 0, scale: 0.95 },
    open: { opacity: 1, scale: 1 }
  };

  return (
    <>
      {/* Overlay mobile avec animation */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar moderne avec animation fluide */}
      <motion.div 
        className={`
          ${isMobile 
            ? 'fixed right-0 top-0 h-full z-50' 
            : 'relative border-l border-border'
          }
          bg-background shadow-lg backdrop-blur-sm
        `}
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        <motion.div 
          className="h-full flex flex-col"
          variants={contentVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ delay: 0.1 }}
        >
          {/* Header moderne */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
              
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="destructive" className="px-2 py-1 text-xs animate-pulse">
                    Actifs
                  </Badge>
                )}
                
                <FilterButton
                  icon={RotateCcw}
                  onClick={onResetFilters}
                  disabled={!hasActiveFilters || isLoading}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Réinitialiser</span>
                </FilterButton>
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              
              {/* Position utilisateur */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Position
                </h3>
                
                <FilterButton
                  onClick={onMyLocationClick}
                  disabled={isLoading}
                  variant={userLocation ? "outline" : "default"}
                  className="w-full justify-between"
                >
                  <span>
                    {userLocation ? 'Position détectée' : 'Détecter ma position'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </FilterButton>
              </div>

              <Separator />

              {/* Filtre "Autour de moi" - NOUVEAU */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Nombre autour de moi
                </h3>
                
                {isLoading ? (
                  <LoadingSkeleton type="filter" />
                ) : (
                  <AroundMeFilter
                    value={filters.aroundMeCount || 5}
                    onChange={(aroundMeCount) => onFiltersChange({ aroundMeCount })}
                    min={1}
                    max={20}
                    size="sm"
                  />
                )}
              </div>

              <Separator />

              {/* Transport */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  Transport
                </h3>
                
                {isLoading ? (
                  <LoadingSkeleton type="filter" />
                ) : (
                  <OptimizedTransportSelector
                    value={filters.transport}
                    onChange={(transport) => onFiltersChange({ transport: transport as any })}
                    size="sm"
                  />
                )}
              </div>

              <Separator />

              {/* Distance OU Durée - Exclusif */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium text-foreground">Limite de recherche</h3>
                </div>
                
                {/* Sélecteur exclusif Distance/Durée */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={!filters.useDuration ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onFiltersChange({ useDuration: false, maxDuration: undefined })}
                    className="h-8 text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Distance
                  </Button>
                  <Button
                    variant={filters.useDuration ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onFiltersChange({ useDuration: true, distance: undefined })}
                    className="h-8 text-xs"
                  >
                    <Timer className="h-3 w-3 mr-1" />
                    Durée
                  </Button>
                </div>
                
                {/* Sélecteur conditionnel */}
                {isLoading ? (
                  <LoadingSkeleton type="filter" />
                ) : !filters.useDuration ? (
                  <div className="space-y-2">
                    <GoogleMapsDistanceSelector
                      value={filters.distance}
                      onChange={(distance) => onFiltersChange({ distance })}
                      unit={filters.unit || 'km'}
                      onUnitChange={(unit) => onFiltersChange({ unit })}
                    />
                    <p className="text-xs text-muted-foreground">Recherche par distance géographique</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <DurationSelector
                      value={filters.maxDuration || 20}
                      onChange={(maxDuration) => onFiltersChange({ maxDuration })}
                    />
                    <p className="text-xs text-muted-foreground">Recherche par temps de trajet</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Catégories */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Catégories
                </h3>
                
                {isLoading ? (
                  <LoadingSkeleton type="filter" />
                ) : (
                  <GoogleMapsCategorySelector
                    selectedCategories={Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []}
                    onChange={(categories) => {
                      onFiltersChange({ category: categories.length > 0 ? categories : undefined });
                      if (categories.length > 0 && onCategoryClick) {
                        onCategoryClick(categories[categories.length - 1]);
                      }
                    }}
                  />
                )}
              </div>

              {/* Export PDF - Desktop uniquement */}
              {!isMobile && (
                <>
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
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
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer mobile */}
          {isMobile && (
            <motion.div 
              className="p-4 border-t border-border"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FilterButton
                onClick={onToggle}
                className="w-full"
                size="default"
              >
                Appliquer les filtres
              </FilterButton>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default ModernSidebar;