
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Filter } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';

interface GeoSearchFiltersPanelProps {
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onTransportChange: (transport: TransportMode) => void;
  onClearCache: () => void;
  isLoading?: boolean;
}

const GeoSearchFiltersPanel: React.FC<GeoSearchFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onTransportChange,
  onClearCache,
  isLoading = false
}) => {
  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({ distance: value[0] });
  };

  const handleTransportSelect = (value: TransportMode) => {
    onTransportChange(value);
    onFiltersChange({ transport: value });
  };

  const handleCountChange = (value: string) => {
    onFiltersChange({ aroundMeCount: parseInt(value) });
  };

  const resetFilters = () => {
    onFiltersChange({
      query: '',
      category: '',
      subcategory: '',
      transport: 'walking',
      distance: 10,
      aroundMeCount: 5
    });
    onClearCache();
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Transport Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mode de transport</label>
          <Select 
            value={filters.transport} 
            onValueChange={handleTransportSelect}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="walking">🚶 À pied</SelectItem>
              <SelectItem value="cycling">🚴 Vélo</SelectItem>
              <SelectItem value="car">🚗 Voiture</SelectItem>
              <SelectItem value="bus">🚌 Bus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Distance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Distance maximale</label>
            <Badge variant="secondary">{filters.distance} km</Badge>
          </div>
          <Slider
            value={[filters.distance || 10]}
            onValueChange={handleDistanceChange}
            max={50}
            min={1}
            step={1}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Number of results */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre de résultats</label>
          <Select 
            value={filters.aroundMeCount?.toString() || '5'} 
            onValueChange={handleCountChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nombre de résultats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 résultats</SelectItem>
              <SelectItem value="5">5 résultats</SelectItem>
              <SelectItem value="10">10 résultats</SelectItem>
              <SelectItem value="20">20 résultats</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            disabled={isLoading}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser les filtres
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClearCache}
            disabled={isLoading}
            className="w-full"
            size="sm"
          >
            Vider le cache
          </Button>
        </div>

        {/* Current filters display */}
        {filters.query && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Recherche actuelle:</p>
            <Badge variant="outline" className="text-xs">
              {filters.query}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoSearchFiltersPanel;
