import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import DistanceUnitToggle from './DistanceUnitToggle';

interface GoogleMapsDistanceSelectorProps {
  value: number;
  onChange: (distance: number) => void;
  unit?: 'km' | 'mi';
  onUnitChange?: (unit: 'km' | 'mi') => void;
}

const presetDistancesKm = [1, 2, 5, 10, 20, 50];
const presetDistancesMi = [1, 2, 3, 5, 10, 25];

const GoogleMapsDistanceSelector: React.FC<GoogleMapsDistanceSelectorProps> = ({
  value,
  onChange,
  unit = 'km',
  onUnitChange
}) => {
  const presetDistances = unit === 'km' ? presetDistancesKm : presetDistancesMi;
  const maxDistance = unit === 'km' ? 100 : 60;
  const unitLabel = unit === 'km' ? 'km' : 'mi';

  return (
    <div className="space-y-4">
      {/* Toggle d'unité */}
      {onUnitChange && (
        <div className="flex justify-center">
          <DistanceUnitToggle
            value={unit}
            onChange={onUnitChange}
            variant="compact"
            size="sm"
          />
        </div>
      )}

      {/* Boutons prédéfinis */}
      <div className="grid grid-cols-3 gap-2">
        {presetDistances.map(distance => (
          <Button
            key={distance}
            variant={value === distance ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(distance)}
            className="text-xs"
          >
            {distance} {unitLabel}
          </Button>
        ))}
      </div>

      {/* Slider pour valeur personnalisée */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Distance personnalisée</span>
          <span className="text-xs font-medium">{value} {unitLabel}</span>
        </div>
        
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={maxDistance}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 {unitLabel}</span>
          <span>{maxDistance} {unitLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsDistanceSelector;