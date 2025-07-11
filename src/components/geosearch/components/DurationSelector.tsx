import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
}

const presetDurations = [5, 10, 15, 20, 30, 45];

const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-4">
      {/* Boutons prédéfinis */}
      <div className="grid grid-cols-3 gap-2">
        {presetDurations.map(duration => (
          <Button
            key={duration}
            variant={value === duration ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(duration)}
            className="text-xs"
          >
            {duration} min
          </Button>
        ))}
      </div>

      {/* Slider pour valeur personnalisée */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Durée personnalisée</span>
          <span className="text-xs font-medium">{value} min</span>
        </div>
        
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={120}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 min</span>
          <span>120 min</span>
        </div>
      </div>
    </div>
  );
};

export default DurationSelector;