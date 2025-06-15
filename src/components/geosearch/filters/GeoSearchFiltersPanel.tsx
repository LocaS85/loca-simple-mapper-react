
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCcw, Settings } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';

interface GeoSearchFiltersPanelProps {
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onTransportChange: (transport: TransportMode) => void;
  onClearCache: () => void;
  isLoading: boolean;
}

const GeoSearchFiltersPanel: React.FC<GeoSearchFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onTransportChange,
  onClearCache,
  isLoading
}) => {
  const transportModes: { mode: TransportMode; label: string; icon: string }[] = [
    { mode: 'walking', label: 'À pied', icon: '🚶' },
    { mode: 'cycling', label: 'Vélo', icon: '🚴' },
    { mode: 'driving', label: 'Voiture', icon: '🚗' },
    { mode: 'transit', label: 'Transport', icon: '🚌' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Filtres
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCache}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Transport Mode */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Mode de transport
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {transportModes.map(({ mode, label, icon }) => (
              <Button
                key={mode}
                variant={filters.transport === mode ? "default" : "outline"}
                size="sm"
                onClick={() => onTransportChange(mode)}
                className="justify-start"
                disabled={isLoading}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Distance maximale: {filters.distance} {filters.unit}
          </Label>
          <Slider
            value={[filters.distance]}
            onValueChange={([value]) => onFiltersChange({ distance: value })}
            max={50}
            min={1}
            step={1}
            disabled={isLoading}
          />
        </div>

        {/* Number of results */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Nombre de résultats: {filters.aroundMeCount}
          </Label>
          <Slider
            value={[filters.aroundMeCount || 5]}
            onValueChange={([value]) => onFiltersChange({ aroundMeCount: value })}
            max={20}
            min={1}
            step={1}
            disabled={isLoading}
          />
        </div>

        {/* Active filters display */}
        {(filters.category || filters.query) && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Filtres actifs
            </Label>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="text-xs">
                  📍 {filters.category}
                </Badge>
              )}
              {filters.query && (
                <Badge variant="secondary" className="text-xs">
                  🔍 {filters.query}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoSearchFiltersPanel;
