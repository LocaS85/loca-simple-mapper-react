import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GoogleMapsDistanceSelectorProps {
  value: number;
  onChange: (distance: number) => void;
}

const presetDistances = [1, 2, 5, 10, 20, 50];

const GoogleMapsDistanceSelector: React.FC<GoogleMapsDistanceSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-4">
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
            {distance} km
          </Button>
        ))}
      </div>

      {/* Slider pour valeur personnalisée */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Distance personnalisée</span>
          <span className="text-xs font-medium">{value} km</span>
        </div>
        
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 km</span>
          <span>100 km</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsDistanceSelector;