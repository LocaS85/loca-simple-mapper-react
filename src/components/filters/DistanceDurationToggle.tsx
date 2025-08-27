import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface DistanceDurationToggleProps {
  mode: 'distance' | 'duration';
  onModeChange: (mode: 'distance' | 'duration') => void;
  distance: number;
  onDistanceChange: (distance: number) => void;
  unit: 'km' | 'mi';
  onUnitChange: (unit: 'km' | 'mi') => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  className?: string;
}

const DistanceDurationToggle: React.FC<DistanceDurationToggleProps> = ({
  mode,
  onModeChange,
  distance,
  onDistanceChange,
  unit,
  onUnitChange,
  duration,
  onDurationChange,
  className
}) => {
  const getMaxDistance = () => unit === 'km' ? 50 : 30;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle principal Distance/Durée */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Distance</Label>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs", mode === 'distance' && "font-medium")}>Distance</span>
          <Switch
            checked={mode === 'duration'}
            onCheckedChange={(checked) => onModeChange(checked ? 'duration' : 'distance')}
          />
          <span className={cn("text-xs", mode === 'duration' && "font-medium")}>Durée</span>
        </div>
      </div>

      {/* Mode Distance */}
      {mode === 'distance' && (
        <div className="space-y-3 animate-fade-in">
          {/* Toggle km/mi et valeur */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{distance} {unit}</span>
            <RadioGroup 
              value={unit} 
              onValueChange={onUnitChange}
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
          
          {/* Slider distance */}
          <Slider 
            min={1} 
            max={getMaxDistance()} 
            step={1} 
            value={[distance]} 
            onValueChange={(val) => onDistanceChange(val[0])} 
          />
          
          <div className="text-xs text-muted-foreground">
            Rayon affiché sur la carte
          </div>
        </div>
      )}

      {/* Mode Durée */}
      {mode === 'duration' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{duration} minutes</span>
          </div>
          
          <Slider 
            min={5} 
            max={120} 
            step={5} 
            value={[duration]} 
            onValueChange={(val) => onDurationChange(val[0])} 
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>2h</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistanceDurationToggle;