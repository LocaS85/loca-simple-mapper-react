
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';
import { Car, User, Bike, Bus } from 'lucide-react';

export interface FenetreFiltrageProp {
  isOpen: boolean;
  onClose: () => void;
  transportMode: TransportMode;
  distance: number;
  distanceUnit: 'km' | 'mi';
  aroundMeCount: number;
  showMultiDirections: boolean;
  maxDuration?: number;
  onTransportModeChange: (mode: TransportMode) => void;
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: 'km' | 'mi') => void;
  onAroundMeCountChange: (count: number) => void;
  onShowMultiDirectionsChange: (show: boolean) => void;
  onMaxDurationChange?: (duration: number) => void;
  onReset: () => void;
}

const FenetreFiltrage: React.FC<FenetreFiltrageProp> = ({
  isOpen,
  onClose,
  transportMode,
  distance,
  distanceUnit,
  aroundMeCount,
  showMultiDirections,
  maxDuration = 20,
  onTransportModeChange,
  onDistanceChange,
  onUnitChange,
  onAroundMeCountChange,
  onShowMultiDirectionsChange,
  onMaxDurationChange,
  onReset
}) => {
  const { t } = useTranslation();

  // Convert between km and mi
  const convertDistance = (value: number, from: 'km' | 'mi', to: 'km' | 'mi'): number => {
    if (from === to) return value;
    return from === 'km' ? value * 0.621371 : value * 1.60934;
  };

  // Handle unit change
  const handleUnitChange = (unit: 'km' | 'mi') => {
    if (unit !== distanceUnit) {
      const newDistance = convertDistance(distance, distanceUnit, unit);
      onDistanceChange(Math.round(newDistance * 10) / 10);
      onUnitChange(unit);
    }
  };

  // Map transport modes to their icons
  const transportModeIcons = {
    car: <Car className="h-4 w-4" />,
    walking: <User className="h-4 w-4" />,
    cycling: <Bike className="h-4 w-4" />,
    bus: <Bus className="h-4 w-4" />,
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[90%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('filters.title')}</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Transport Mode */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('filters.transportMode')}</h3>
            <div className="flex flex-wrap gap-2">
              {(['car', 'walking', 'cycling', 'bus'] as TransportMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={transportMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTransportModeChange(mode)}
                  className="flex items-center gap-2"
                >
                  {transportModeIcons[mode]}
                  {t(`filters.transportModes.${mode}`)}
                </Button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('filters.distance')}</h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{distance}</span>
                <div className="flex rounded-md overflow-hidden border border-border">
                  <button
                    onClick={() => handleUnitChange('km')}
                    className={`px-2 py-1 text-xs ${
                      distanceUnit === 'km' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    km
                  </button>
                  <button
                    onClick={() => handleUnitChange('mi')}
                    className={`px-2 py-1 text-xs ${
                      distanceUnit === 'mi' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    mi
                  </button>
                </div>
              </div>
            </div>
            <Slider
              value={[distance]}
              min={1}
              max={distanceUnit === 'km' ? 50 : 30}
              step={1}
              onValueChange={(values) => onDistanceChange(values[0])}
            />
          </div>

          {/* "Around Me" Count */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('filters.aroundMeCount')}</h3>
              <span className="font-semibold">{aroundMeCount}</span>
            </div>
            <Slider
              value={[aroundMeCount]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => onAroundMeCountChange(values[0])}
            />
          </div>

          {/* Max Duration */}
          {onMaxDurationChange && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{t('filters.maxDuration')}</h3>
                <span className="font-semibold">
                  {maxDuration} {t('common.minutes')}
                </span>
              </div>
              <Slider
                value={[maxDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(values) => onMaxDurationChange(values[0])}
              />
            </div>
          )}

          {/* Show Multi Directions */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('filters.showMultiDirections')}</h3>
            <Button
              variant={showMultiDirections ? "default" : "outline"}
              size="sm"
              onClick={() => onShowMultiDirectionsChange(!showMultiDirections)}
            >
              {showMultiDirections ? t('common.yes') : t('common.no')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button className="w-full" onClick={onClose}>
            {t('common.apply')}
          </Button>
          <Button variant="outline" className="w-full" onClick={onReset}>
            {t('common.reset')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FenetreFiltrage;
