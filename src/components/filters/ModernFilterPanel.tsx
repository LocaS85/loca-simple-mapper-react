import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import TransportIconGrid from './TransportIconGrid';
import DistanceDurationToggle from './DistanceDurationToggle';
import { useSupabaseCategories, Category } from '@/hooks/useSupabaseCategories';

interface ModernFilterPanelProps {
  filters: {
    transport: string;
    distanceMode: 'distance' | 'duration';
    distance: number;
    unit: 'km' | 'mi';
    duration: number;
    aroundMeCount: number;
    category: string | null;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilter: (key: string) => void;
  className?: string;
}

const ModernFilterPanel: React.FC<ModernFilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilter,
  className
}) => {
  const { categories, loading } = useSupabaseCategories();

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
    
    if (filters.distanceMode === 'distance' && filters.distance !== 10) {
      badges.push({
        key: 'distance',
        label: `${filters.distance} ${filters.unit}`,
        value: filters.distance
      });
    }
    
    if (filters.distanceMode === 'duration' && filters.duration !== 15) {
      badges.push({
        key: 'duration',
        label: `${filters.duration} min`,
        value: filters.duration
      });
    }
    
    if (filters.aroundMeCount !== 5) {
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
          mode={filters.distanceMode}
          onModeChange={(mode) => onFilterChange('distanceMode', mode)}
          distance={filters.distance}
          onDistanceChange={(distance) => onFilterChange('distance', distance)}
          unit={filters.unit}
          onUnitChange={(unit) => onFilterChange('unit', unit)}
          duration={filters.duration}
          onDurationChange={(duration) => onFilterChange('duration', duration)}
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
            value={filters.category || ''} 
            onValueChange={(value) => onFilterChange('category', value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              {categories.map((cat: Category) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ModernFilterPanel;