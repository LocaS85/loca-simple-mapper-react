import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Ruler,
  Navigation,
  Heart,
  History,
  RotateCcw
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
    onFiltersChange({
      ...filters,
      distance: value[0]
    });
  };

  const handleDurationChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      duration: value[0]
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
    onResetFilters();
    toast.success("Filtres réinitialisés");
  };

  const hasActiveFilters = selectedSubcategories.size > 0 || filters.distance !== 5 || filters.transport !== 'walking';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres & Recherche
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

            {/* Actions rapides */}
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
            <div className="space-y-6 py-4">
              {/* Barre de recherche */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Recherche
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher un lieu, type..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearchSubmit} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Sélecteur de transport */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  Mode de transport
                </h3>
                <ModernTransportManager
                  selectedMode={filters.transport || 'walking'}
                  onModeChange={handleTransportChange}
                  className="grid grid-cols-2 gap-2"
                />
              </div>

              <Separator />

              {/* Distance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-primary" />
                    Distance maximale
                  </h3>
                  <Badge variant="secondary">
                    {filters.distance || 5} {filters.unit || 'km'}
                  </Badge>
                </div>
                <Slider
                  value={[filters.distance || 5]}
                  onValueChange={handleDistanceChange}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>

              <Separator />

              {/* Durée */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Durée maximale
                  </h3>
                  <Badge variant="secondary">
                    {filters.duration || 15} min
                  </Badge>
                </div>
                <Slider
                  value={[filters.duration || 15]}
                  onValueChange={handleDurationChange}
                  max={120}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>2h</span>
                </div>
              </div>

              <Separator />

              {/* Catégories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Catégories
                  </h3>
                  {selectedSubcategories.size > 0 && (
                    <Badge variant="outline">
                      {selectedSubcategories.size} sélectionnée{selectedSubcategories.size > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Chargement des catégories...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-4">
                    <p className="text-sm text-destructive">Erreur de chargement</p>
                  </div>
                )}

                {categories && categories.length > 0 && (
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Collapsible
                        key={category.id}
                        open={expandedCategories.has(category.id)}
                        onOpenChange={() => toggleCategory(category.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{category.name}</span>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {category.subcategories.length}
                                </Badge>
                              )}
                            </div>
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="space-y-1">
                          {category.subcategories?.map((subcategory) => (
                            <Button
                              key={subcategory.id}
                              variant={selectedSubcategories.has(subcategory.id) ? "default" : "ghost"}
                              size="sm"
                              onClick={() => toggleSubcategory(subcategory.id)}
                              className={cn(
                                "w-full justify-start ml-4 text-xs",
                                selectedSubcategories.has(subcategory.id) && "bg-primary text-primary-foreground"
                              )}
                            >
                              {subcategory.name}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </div>

              {/* Liens rapides */}
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Accès rapide</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Favoris
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Historique
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer avec statistiques */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {resultsCount > 0 ? `${resultsCount} résultat${resultsCount > 1 ? 's' : ''}` : 'Aucun résultat'}
              </span>
              {userLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Position détectée
                </span>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernFilterSidebar;