import React from 'react';
import { Button } from '@/components/ui/button';
import SliderInput from './SliderInput';

interface AroundMeFilterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showPresets?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AroundMeFilter: React.FC<AroundMeFilterProps> = ({
  value,
  onChange,
  min = 1,
  max = 20,
  showPresets = true,
  size = 'sm'
}) => {
  const presets = [5, 10, 15, 20];

  return (
    <div className="space-y-3">
      {/* Boutons presets */}
      {showPresets && (
        <div className="grid grid-cols-4 gap-1">
          {presets.map(preset => (
            <Button
              key={preset}
              variant={value === preset ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(preset)}
              className={`
                h-8 text-xs transition-all duration-200
                ${value === preset ? 'bg-primary text-primary-foreground shadow-md' : ''}
                hover:scale-105 active:scale-95
              `}
            >
              {preset}
            </Button>
          ))}
        </div>
      )}

      {/* Slider pour valeur personnalisée */}
      <SliderInput
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={1}
        label="Nombre personnalisé"
        unit="résultats"
        size={size}
      />
    </div>
  );
};

export default AroundMeFilter;