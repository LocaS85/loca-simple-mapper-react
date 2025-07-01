import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, User, Bike, Train, Filter, RefreshCw } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import { unifiedCategories } from '@/data/unifiedCategories';
import { cn } from '@/lib/utils';

interface GeoSearchFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onReset: () => void;
}

const transportModes = [
  { id: 'walking', name: 'À pied', icon: <User className="h-4 w-4" /> },
  { id: 'cycling', name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'driving', name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'transit', name: 'Transport', icon: <Train className="h-4 w-4" /> },
];

const GeoSearchFiltersSheet: React.FC<GeoSearchFiltersSheetProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  onReset
}) => {
  const selectedCategory = unifiedCategories.find(cat => cat.id === filters.category);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[90%] sm:w-[450px] overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <SheetTitle>Filtres de recherche</SheetTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            className="flex items-center gap-1 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
            Réinitialiser
          </Button>
          <SheetClose className="absolute right-4 top-4" />
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Catégorie */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Catégorie</h3>
            <Select 
              value={filters.category || ''} 
              onValueChange={(value) => onFiltersChange({ category: value || null })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {unifiedCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sous-catégorie */}
            {subcategories.length > 0 && (
              <Select 
                value={filters.subcategory || ''} 
                onValueChange={(value) => onFiltersChange({ subcategory: value || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les sous-catégories</SelectItem>
                  {subcategories.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Mode de transport */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Mode de transport</h3>
            <div className="grid grid-cols-2 gap-2">
              {transportModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={filters.transport === mode.id ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2 justify-start",
                    filters.transport === mode.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => onFiltersChange({ transport: mode.id as any })}
                >
                  {mode.icon}
                  <span>{mode.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Distance</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={filters.unit === 'km' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFiltersChange({ unit: 'km' })}
                  className="h-7 px-2 text-xs"
                >
                  km
                </Button>
                <Button
                  variant={filters.unit === 'mi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFiltersChange({ unit: 'mi' })}
                  className="h-7 px-2 text-xs"
                >
                  mi
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                value={[filters.distance]}
                min={1}
                max={filters.unit === 'km' ? 50 : 30}
                step={1}
                onValueChange={(values) => onFiltersChange({ distance: values[0] })}
              />
              <span className="text-sm font-medium min-w-[50px] text-right">
                {filters.distance} {filters.unit}
              </span>
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Durée maximale</h3>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                value={[filters.maxDuration || 20]}
                min={5}
                max={60}
                step={5}
                onValueChange={(values) => onFiltersChange({ maxDuration: values[0] })}
              />
              <span className="text-sm font-medium min-w-[60px] text-right">
                {filters.maxDuration || 20} min
              </span>
            </div>
          </div>

          {/* Nombre de résultats */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Nombre de résultats</h3>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                value={[filters.aroundMeCount || 5]}
                min={1}
                max={20}
                step={1}
                onValueChange={(values) => onFiltersChange({ aroundMeCount: values[0] })}
              />
              <span className="text-sm font-medium min-w-[30px] text-right">
                {filters.aroundMeCount || 5}
              </span>
            </div>
          </div>

          {/* Options avancées */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-medium">Options avancées</h3>
            <div className="flex items-center justify-between">
              <Label>Itinéraires multiples</Label>
              <Switch
                checked={filters.showMultiDirections || false}
                onCheckedChange={(checked) => onFiltersChange({ showMultiDirections: checked })}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-6 border-t mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fermer
          </Button>
          <Button onClick={onClose} className="flex-1">
            Appliquer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GeoSearchFiltersSheet;