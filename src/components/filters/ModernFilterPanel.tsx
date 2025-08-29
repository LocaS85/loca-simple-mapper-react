import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, MapPin } from 'lucide-react';
import TransportIconGrid from './TransportIconGrid';
import DistanceDurationToggle from './DistanceDurationToggle';
import { useSupabaseCategories, Category } from '@/hooks/useSupabaseCategories';
import CategoryIconService from '@/services/CategoryIconService';

interface ModernFilterPanelProps {
  filters: {
    transport: string;
    distance: number;
    unit: string;
    aroundMeCount: number;
    category: string | null;
    maxDuration: number;
    showMultiDirections?: boolean;
  };
  distanceMode: 'distance' | 'duration';
  onFilterChange: (key: string, value: any) => void;
  onClearFilter: (key: string) => void;
  onDistanceModeChange: (mode: 'distance' | 'duration') => void;
  className?: string;
}

const ModernFilterPanel: React.FC<ModernFilterPanelProps> = ({
  filters,
  distanceMode,
  onFilterChange,
  onClearFilter,
  onDistanceModeChange,
  className
}) => {
  const { categories, loading } = useSupabaseCategories();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Calculer les badges de filtres actifs
  const getActiveBadges = () => {
    const badges = [];
    
    if (filters.transport !== 'walking') {
      badges.push({
        key: 'transport',
        label: `Transport: ${filters.transport}`,
        value: filters.transport
      });
    }
    
    if (distanceMode === 'distance' && filters.distance !== 5) {
      badges.push({
        key: 'distance',
        label: `${filters.distance} ${filters.unit}`,
        value: filters.distance
      });
    }
    
    if (distanceMode === 'duration' && filters.maxDuration !== 30) {
      badges.push({
        key: 'maxDuration',
        label: `${filters.maxDuration} min`,
        value: filters.maxDuration
      });
    }
    
    if (filters.aroundMeCount !== 10) {
      badges.push({
        key: 'aroundMeCount',
        label: `${filters.aroundMeCount} établissements`,
        value: filters.aroundMeCount
      });
    }
    
    if (filters.category) {
      const cat = categories.find(c => c.id === filters.category);
      badges.push({
        key: 'category',
        label: `Catégorie: ${cat?.name || filters.category}`,
        value: filters.category
      });
    }
    
    return badges;
  };

  const activeBadges = getActiveBadges();

  return (
    <div className={className}>
      {/* Badges des filtres actifs */}
      {activeBadges.length > 0 && (
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Filtres actifs</Label>
          <div className="flex flex-wrap gap-2">
            {activeBadges.map((badge) => (
              <Badge key={badge.key} variant="secondary" className="flex items-center gap-1">
                {badge.label}
                <button
                  onClick={() => onClearFilter(badge.key)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Transport en pavés */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Mode de transport</Label>
          <TransportIconGrid
            selectedMode={filters.transport}
            onModeChange={(mode) => onFilterChange('transport', mode)}
          />
        </div>

        {/* Toggle Distance/Durée */}
        <DistanceDurationToggle
          mode={distanceMode}
          onModeChange={onDistanceModeChange}
          distance={filters.distance}
          onDistanceChange={(distance) => onFilterChange('distance', distance)}
          unit={filters.unit as 'km' | 'mi'}
          onUnitChange={(unit) => onFilterChange('unit', unit)}
          duration={filters.maxDuration}
          onDurationChange={(duration) => onFilterChange('maxDuration', duration)}
        />

        {/* Nombre d'établissements */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Nombre d'établissements autour de moi</Label>
            <span className="text-sm font-medium">{filters.aroundMeCount}</span>
          </div>
          <Slider 
            min={1} 
            max={10} 
            step={1} 
            value={[filters.aroundMeCount]} 
            onValueChange={(val) => onFilterChange('aroundMeCount', val[0])} 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Catégories */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Catégorie</Label>
          <Select 
            value={filters.category || "all"} 
            onValueChange={(value) => {
              const categoryValue = value === "all" ? null : value;
              onFilterChange('category', categoryValue);
              // Reset subcategory when category changes
              setSelectedSubcategory(null);
            }}
          >
            <SelectTrigger className="flex items-center gap-2">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Toutes les catégories
              </SelectItem>
              {categories.map((category) => {
                const IconComponent = CategoryIconService.getCategoryIcon(category);
                return (
                  <SelectItem key={category.id} value={category.id} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" style={{ color: category.color }} />
                    {category.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Sélecteur de sous-catégorie */}
          {filters.category && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sous-catégorie</Label>
              <Select 
                value={selectedSubcategory || "all"} 
                onValueChange={(value) => {
                  const subcategoryValue = value === "all" ? null : value;
                  setSelectedSubcategory(subcategoryValue);
                  onFilterChange('subcategory', subcategoryValue);
                }}
              >
                <SelectTrigger className="flex items-center gap-2">
                  <SelectValue placeholder="Sélectionner une sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Toutes les sous-catégories
                  </SelectItem>
                  {categories
                    .find(cat => cat.id === filters.category)
                    ?.subcategories?.map((subcategory) => {
                      const parentCategory = categories.find(cat => cat.id === filters.category);
                      const IconComponent = CategoryIconService.getSubcategoryIcon(subcategory, parentCategory);
                      return (
                        <SelectItem key={subcategory.id} value={subcategory.id} className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" style={{ color: parentCategory?.color }} />
                          {subcategory.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernFilterPanel;