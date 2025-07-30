import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  X, 
  RotateCcw, 
  MapPin, 
  Clock, 
  Route,
  Download,
  ChevronDown,
  ChevronRight,
  Info,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import { useIsMobile } from '@/hooks/use-mobile';
import LoadingSkeleton from '../atoms/LoadingSkeleton';
import GoogleMapsTransportSelector from '../components/GoogleMapsTransportSelector';
import GoogleMapsCategorySelector from '../components/GoogleMapsCategorySelector';
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
  const { categories, loading: categoriesLoading } = useSupabaseCategories();
  const isMobile = useIsMobile();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  // États pour la logique exclusive Distance vs Durée
  const [activeFilterMode, setActiveFilterMode] = useState<'distance' | 'duration' | null>(
    filters.useDuration ? 'duration' : 'distance'
  );

  // Synchroniser la recherche locale avec les props
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    (activeFilterMode === 'distance' && filters.distance !== 10) ||
    (activeFilterMode === 'duration' && filters.maxDuration !== 20) ||
    filters.aroundMeCount !== 5 ||
    filters.unit !== 'km';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.transport !== 'walking') count++;
    if (activeFilterMode === 'distance' && filters.distance !== 10) count++;
    if (activeFilterMode === 'duration' && filters.maxDuration !== 20) count++;
    if (filters.aroundMeCount !== 5) count++;
    if (filters.unit !== 'km') count++;
    return count;
  };

  const handleResetFilters = () => {
    setActiveFilterMode('distance');
    setLocalSearchQuery('');
    onResetFilters();
    if (onSearchChange) onSearchChange('');
    toast.success("Filtres réinitialisés");
  };

  const handleDistanceChange = (value: number[]) => {
    setActiveFilterMode('distance');
    onFiltersChange({
      distance: value[0],
      useDuration: false,
      maxDuration: undefined
    });
    toast.info("Filtre par distance activé", {
      description: "Le filtre par durée a été désactivé"
    });
  };

  const handleDurationChange = (value: number[]) => {
    setActiveFilterMode('duration');
    onFiltersChange({
      maxDuration: value[0],
      useDuration: true,
      distance: undefined
    });
    toast.info("Filtre par durée activé", {
      description: "Le filtre par distance a été désactivé"
    });
  };

  const sidebarVariants = {
    closed: {
      x: isMobile ? '100%' : 0,
      width: isMobile ? '320px' : '0px',
      opacity: isMobile ? 0 : 1,
    },
    open: {
      x: 0,
      width: isMobile ? '320px' : '420px',
      opacity: 1,
    }
  };

  const contentVariants = {
    closed: { opacity: 0, scale: 0.95 },
    open: { opacity: 1, scale: 1 }
  };

  if (!isOpen && !isMobile) return null;

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar unifiée */}
      <motion.div 
        className={`
          ${isMobile 
            ? 'fixed right-0 top-0 h-full z-50' 
            : 'relative border-l border-border'
          }
          bg-background shadow-lg
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
          {/* Header avec titre et bouton reset */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filtres</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="destructive" className="text-xs">
                    {getActiveFiltersCount()} actif{getActiveFiltersCount() > 1 ? 's' : ''}
                  </Badge>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        disabled={!hasActiveFilters || isLoading}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Réinitialiser tous les filtres</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Barre de recherche intégrée */}
            {onSearchChange && (
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Que cherchez-vous ?"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearchChange(localSearchQuery)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => onSearchChange(localSearchQuery)} 
                  size="default" 
                  className="px-4"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Contenu scrollable */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
              
              {/* Position utilisateur */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Position
                </h3>
                
                <Button
                  variant={userLocation ? "outline" : "default"}
                  size="sm"
                  onClick={onMyLocationClick}
                  disabled={isLoading}
                  className="w-full justify-between h-10"
                >
                  <span>
                    {userLocation ? 'Position détectée' : 'Détecter ma position'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              {/* Transport */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  Mode de transport
                </h3>
                
                {isLoading ? (
                  <LoadingSkeleton type="filter" />
                ) : (
                  <GoogleMapsTransportSelector
                    value={filters.transport}
                    onChange={(transport) => onFiltersChange({ transport: transport as any })}
                  />
                )}
              </div>

              <Separator />

              {/* Filtres exclusifs Distance OU Durée */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Distance OU Durée</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choisissez soit la distance, soit la durée.<br/>Les deux ne peuvent pas être actifs simultanément.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Distance avec état visuel */}
                <div className={cn(
                  "space-y-3 p-4 rounded-lg border transition-all",
                  activeFilterMode === 'distance' || (!filters.useDuration && filters.distance)
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/50 bg-muted/20 opacity-70"
                )}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Distance maximale</label>
                    {(activeFilterMode === 'distance' || (!filters.useDuration && filters.distance)) && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {filters.distance || 10} km
                      </Badge>
                    )}
                  </div>
                  <Slider
                    value={[filters.distance || 10]}
                    onValueChange={handleDistanceChange}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                    disabled={activeFilterMode === 'duration'}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                </div>

                {/* Durée avec état visuel */}
                <div className={cn(
                  "space-y-3 p-4 rounded-lg border transition-all",
                  activeFilterMode === 'duration' || filters.useDuration
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/50 bg-muted/20 opacity-70"
                )}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Durée maximale</label>
                    {(activeFilterMode === 'duration' || filters.useDuration) && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {filters.maxDuration || 20} min
                      </Badge>
                    )}
                  </div>
                  <Slider
                    value={[filters.maxDuration || 20]}
                    onValueChange={handleDurationChange}
                    max={60}
                    min={5}
                    step={5}
                    className="w-full"
                    disabled={activeFilterMode === 'distance'}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>1h</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Filtre "Autour de moi" (0-10) */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Autour de moi
                </h3>
                
                <div className="space-y-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Nombre de résultats</label>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {filters.aroundMeCount || 5}
                    </Badge>
                  </div>
                  <Slider
                    value={[filters.aroundMeCount || 5]}
                    onValueChange={(value) => onFiltersChange({ aroundMeCount: value[0] })}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Catégories */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-primary" />
                  Catégories
                </h3>
                
                {isLoading || categoriesLoading ? (
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
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      Export PDF
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

          {/* Footer mobile avec statistiques */}
          {isMobile && (
            <div className="p-4 border-t bg-background">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>
                  {resultsCount > 0 ? `${resultsCount} résultat${resultsCount > 1 ? 's' : ''}` : 'Aucun résultat'}
                </span>
                {userLocation && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Position détectée
                  </Badge>
                )}
              </div>
              <Button
                onClick={onToggle}
                className="w-full"
                size="sm"
              >
                Appliquer les filtres
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default ModernSidebar;