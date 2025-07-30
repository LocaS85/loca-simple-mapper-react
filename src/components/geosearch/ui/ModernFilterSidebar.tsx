import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  MapPin,
  RotateCcw,
  Clock,
  MapPinIcon
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import QuickActionsBar from './QuickActionsBar';
import ModernTransportManager from '../components/ModernTransportManager';

interface ModernFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onResetFilters: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userLocation: [number, number] | null;
  resultsCount: number;
}

const ModernFilterSidebar: React.FC<ModernFilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  searchQuery,
  onSearchChange,
  userLocation,
  resultsCount
}) => {
  const { categories, loading, error } = useSupabaseCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [activeFilterMode, setActiveFilterMode] = useState<'distance' | 'duration' | null>(null);

  // Synchroniser la recherche locale avec les props
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newSelected = new Set(selectedSubcategories);
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId);
    } else {
      newSelected.add(subcategoryId);
    }
    setSelectedSubcategories(newSelected);
    
    // Mettre à jour les filtres
    onFiltersChange({
      ...filters,
      subcategories: Array.from(newSelected)
    });
  };

  const handleSearchSubmit = () => {
    onSearchChange(localSearchQuery);
  };

  const handleDistanceChange = (value: number[]) => {
    setActiveFilterMode('distance');
    onFiltersChange({
      ...filters,
      distance: value[0],
      duration: undefined // Désactiver durée quand distance est utilisée
    });
    toast.info("Filtre par distance activé", {
      description: "Le filtre par durée a été désactivé"
    });
  };

  const handleDurationChange = (value: number[]) => {
    setActiveFilterMode('duration');
    onFiltersChange({
      ...filters,
      duration: value[0],
      distance: undefined // Désactiver distance quand durée est utilisée
    });
    toast.info("Filtre par durée activé", {
      description: "Le filtre par distance a été désactivé"
    });
  };

  const handleTransportChange = (transport: string) => {
    onFiltersChange({
      ...filters,
      transport
    });
  };

  const clearAllFilters = () => {
    setSelectedSubcategories(new Set());
    setLocalSearchQuery('');
    setActiveFilterMode(null);
    onResetFilters();
    toast.success("Filtres réinitialisés");
  };

  const hasActiveFilters = selectedSubcategories.size > 0 || filters.distance !== 5 || filters.transport !== 'walking';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px] sm:w-[480px] p-0 flex flex-col">
        {/* Header épuré */}
        <SheetHeader className="p-6 pb-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              Filtres de recherche
            </SheetTitle>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Actions rapides intégrées */}
          <QuickActionsBar
            searchQuery={searchQuery}
            filters={filters}
            resultsCount={resultsCount}
            userLocation={userLocation}
            className="mt-4"
          />
        </SheetHeader>

        {/* Contenu scrollable */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-8 py-6">
            {/* Barre de recherche épurée */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Que cherchez-vous ?"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="flex-1 h-11"
                />
                <Button onClick={handleSearchSubmit} size="default" className="px-4">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Transport */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Mode de transport</h3>
              <ModernTransportManager
                selectedMode={filters.transport || 'walking'}
                onModeChange={handleTransportChange}
                className="grid grid-cols-2 gap-3"
              />
            </div>

            <Separator />

            {/* Filtres exclusifs Distance OU Durée */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">Distance OU Durée</h3>
                <Badge variant="outline" className="text-xs">
                  Exclusif
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
                💡 Choisissez soit la distance, soit la durée de trajet. Les deux ne peuvent pas être actifs en même temps.
              </div>

              {/* Distance avec état visuel */}
              <div className={cn(
                "space-y-4 p-4 rounded-lg border transition-all",
                activeFilterMode === 'distance' || (!activeFilterMode && filters.distance)
                  ? "border-primary/50 bg-primary/5" 
                  : "border-border/50 bg-muted/20 opacity-70"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className={cn(
                      "h-4 w-4",
                      activeFilterMode === 'distance' || (!activeFilterMode && filters.distance)
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )} />
                    <label className="text-sm font-medium">Distance maximale</label>
                  </div>
                  {(activeFilterMode === 'distance' || (!activeFilterMode && filters.distance)) && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {filters.distance || 5} km
                    </Badge>
                  )}
                </div>
                <Slider
                  value={[filters.distance || 5]}
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
                "space-y-4 p-4 rounded-lg border transition-all",
                activeFilterMode === 'duration' || (!activeFilterMode && filters.duration)
                  ? "border-primary/50 bg-primary/5" 
                  : "border-border/50 bg-muted/20 opacity-70"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={cn(
                      "h-4 w-4",
                      activeFilterMode === 'duration' || (!activeFilterMode && filters.duration)
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )} />
                    <label className="text-sm font-medium">Durée maximale</label>
                  </div>
                  {(activeFilterMode === 'duration' || (!activeFilterMode && filters.duration)) && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {filters.duration || 15} min
                    </Badge>
                  )}
                </div>
                <Slider
                  value={[filters.duration || 15]}
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

            {/* Catégories épurées */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Catégories</h3>
                {selectedSubcategories.size > 0 && (
                  <Badge variant="outline" className="bg-primary/5">
                    {selectedSubcategories.size}
                  </Badge>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-center py-4 text-sm text-destructive">
                  Erreur de chargement des catégories
                </div>
              )}

              {categories && categories.length > 0 && (
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <Collapsible
                      key={category.id}
                      open={expandedCategories.has(category.id)}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto border border-border/50 hover:border-border hover:bg-muted/30"
                        >
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center gap-2">
                            {category.subcategories && category.subcategories.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {category.subcategories.length}
                              </Badge>
                            )}
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-1 mt-1">
                        <div className="ml-4 space-y-1">
                          {category.subcategories?.map((subcategory) => (
                            <Button
                              key={subcategory.id}
                              variant={selectedSubcategories.has(subcategory.id) ? "default" : "ghost"}
                              size="sm"
                              onClick={() => toggleSubcategory(subcategory.id)}
                              className={cn(
                                "w-full justify-start text-sm h-9",
                                selectedSubcategories.has(subcategory.id) 
                                  ? "bg-primary text-primary-foreground" 
                                  : "hover:bg-muted/50"
                              )}
                            >
                              {subcategory.name}
                            </Button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer simplifié */}
        <div className="p-6 border-t bg-muted/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {resultsCount > 0 ? `${resultsCount} résultat${resultsCount > 1 ? 's' : ''}` : 'Aucun résultat'}
            </span>
            {userLocation && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Position détectée
              </Badge>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernFilterSidebar;