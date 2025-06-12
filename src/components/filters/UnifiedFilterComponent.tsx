
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, User, Bike, Bus, Compass, Route } from 'lucide-react';
import { TransportMode, DistanceUnit } from '@/types/map';
import { useTranslation } from 'react-i18next';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';
import { cn } from '@/lib/utils';

interface UnifiedFilterComponentProps {
  filters: UnifiedFilters;
  onFilterChange: <K extends keyof UnifiedFilters>(key: K, value: UnifiedFilters[K]) => void;
  onFiltersChange: (filters: Partial<UnifiedFilters>) => void;
  compact?: boolean;
  showCategories?: boolean;
  categories?: Array<{ id: string; name: string; }>;
}

const transportModes = [
  { id: 'driving' as TransportMode, name: 'Voiture', icon: Car },
  { id: 'walking' as TransportMode, name: 'À pied', icon: User },
  { id: 'cycling' as TransportMode, name: 'Vélo', icon: Bike },
  { id: 'bus' as TransportMode, name: 'Transport', icon: Bus },
];

const UnifiedFilterComponent: React.FC<UnifiedFilterComponentProps> = ({
  filters,
  onFilterChange,
  onFiltersChange,
  compact = false,
  showCategories = false,
  categories = []
}) => {
  const { t } = useTranslation();

  const getMaxDistanceValue = () => {
    return filters.unit === 'km' ? 50 : 30;
  };

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {/* Catégorie */}
      {showCategories && categories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("filters.category")}</Label>
          <Select 
            value={filters.category || ''} 
            onValueChange={(value) => onFilterChange('category', value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filters.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("categories.allCategories")}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Mode de transport */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.transportMode")}</Label>
        <div className={cn(
          "grid gap-2",
          compact ? "grid-cols-2" : "grid-cols-4"
        )}>
          {transportModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={filters.transport === mode.id ? "default" : "outline"}
                size={compact ? "sm" : "default"}
                className="flex items-center gap-1"
                onClick={() => onFilterChange('transport', mode.id)}
              >
                <Icon className="h-4 w-4" />
                <span className={cn("text-xs", !compact && "text-sm")}>
                  {t(`filters.transportModes.${mode.id}`)}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">{t("filters.labels.maxDistance")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{filters.distance} {filters.unit}</span>
            <RadioGroup 
              value={filters.unit} 
              onValueChange={(value: DistanceUnit) => onFilterChange('unit', value)}
              className="flex items-center space-x-1"
            >
              <div className="flex items-center">
                <RadioGroupItem value="km" id="km" className="h-3 w-3" />
                <Label htmlFor="km" className="ml-1 text-xs">km</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="mi" id="mi" className="h-3 w-3" />
                <Label htmlFor="mi" className="ml-1 text-xs">mi</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Slider 
          min={1} 
          max={getMaxDistanceValue()} 
          step={1} 
          value={[filters.distance]} 
          onValueChange={(val) => onFilterChange('distance', val[0])} 
        />
      </div>

      {/* Durée maximale */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">{t("filters.labels.maxDuration")}</Label>
          <span className="text-sm font-medium">{filters.maxDuration} min</span>
        </div>
        <Slider 
          min={5} 
          max={60} 
          step={5} 
          value={[filters.maxDuration]} 
          onValueChange={(val) => onFilterChange('maxDuration', val[0])} 
        />
      </div>

      {/* Section "Autour de moi" */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">{t("filters.aroundMe")}</Label>
        </div>
        
        <div className="space-y-4">
          {/* Nombre de résultats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm">{t("filters.places")}</Label>
              <span className="text-sm font-medium">{filters.aroundMeCount}</span>
            </div>
            <Slider 
              min={1} 
              max={10} 
              step={1} 
              value={[filters.aroundMeCount]} 
              onValueChange={(val) => onFilterChange('aroundMeCount', val[0])} 
            />
          </div>
          
          {/* Multi-directions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-primary" />
              <Label className="text-sm">{t("filters.multiDirections")}</Label>
            </div>
            <Switch 
              checked={filters.showMultiDirections}
              onCheckedChange={(checked) => onFilterChange('showMultiDirections', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedFilterComponent;
