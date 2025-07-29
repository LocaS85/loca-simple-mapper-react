import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = '',
  showValue = true,
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header avec label et valeur */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={`
              font-medium text-muted-foreground
              ${size === 'sm' ? 'text-xs' : ''}
              ${size === 'md' ? 'text-sm' : ''}
              ${size === 'lg' ? 'text-base' : ''}
            `}>
              {label}
            </span>
          )}
          
          {showValue && (
            <span className={`
              font-semibold text-foreground
              ${size === 'sm' ? 'text-xs' : ''}
              ${size === 'md' ? 'text-sm' : ''}
              ${size === 'lg' ? 'text-base' : ''}
            `}>
              {value} {unit}
            </span>
          )}
        </div>
      )}
      
      {/* Slider */}
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className={`
          w-full
          ${size === 'sm' ? 'h-1' : ''}
          ${size === 'md' ? 'h-2' : ''}
          ${size === 'lg' ? 'h-3' : ''}
        `}
      />
      
      {/* Indicateurs min/max */}
      <div className="flex justify-between">
        <span className={`
          text-muted-foreground
          ${size === 'sm' ? 'text-xs' : ''}
          ${size === 'md' ? 'text-sm' : ''}
          ${size === 'lg' ? 'text-base' : ''}
        `}>
          {min} {unit}
        </span>
        <span className={`
          text-muted-foreground
          ${size === 'sm' ? 'text-xs' : ''}
          ${size === 'md' ? 'text-sm' : ''}
          ${size === 'lg' ? 'text-base' : ''}
        `}>
          {max} {unit}
        </span>
      </div>
    </div>
  );
};

export default SliderInput;