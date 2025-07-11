import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DistanceUnitToggleProps {
  value: 'km' | 'mi';
  onChange: (unit: 'km' | 'mi') => void;
  variant?: 'button' | 'toggle' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const DistanceUnitToggle: React.FC<DistanceUnitToggleProps> = ({
  value,
  onChange,
  variant = 'toggle',
  size = 'sm',
  className = ''
}) => {
  
  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => onChange(value === 'km' ? 'mi' : 'km')}
        className={`min-w-[60px] ${className}`}
      >
        {value === 'km' ? 'km' : 'mi'}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex rounded-md border border-gray-200 bg-white ${className}`}>
        <button
          onClick={() => onChange('km')}
          className={`
            px-3 py-1 text-xs font-medium rounded-l-md transition-colors
            ${value === 'km' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          km
        </button>
        <button
          onClick={() => onChange('mi')}
          className={`
            px-3 py-1 text-xs font-medium rounded-r-md transition-colors border-l border-gray-200
            ${value === 'mi' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          mi
        </button>
      </div>
    );
  }

  // Default toggle variant
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue: 'km' | 'mi') => {
        if (newValue) onChange(newValue);
      }}
      className={className}
    >
      <ToggleGroupItem 
        value="km" 
        aria-label="Kilomètres"
        size={size}
      >
        km
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="mi" 
        aria-label="Miles"
        size={size}
      >
        mi
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default DistanceUnitToggle;