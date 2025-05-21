
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransportMode } from '@/lib/data/transportModes';
import { Button } from '@/components/ui/button';
import { Filter, Car, User, Bike, Bus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CategoryFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
  aroundMeCount: number;
  setAroundMeCount: (count: number) => void;
  showMultiDirections: boolean;
  setShowMultiDirections: (show: boolean) => void;
  distanceUnit: 'km' | 'mi';
  setDistanceUnit: (unit: 'km' | 'mi') => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
}

const transportModes = [
  { id: 'car' as TransportMode, name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'walking' as TransportMode, name: 'À pied', icon: <User className="h-4 w-4" /> },
  { id: 'cycling' as TransportMode, name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'bus' as TransportMode, name: 'Transport', icon: <Bus className="h-4 w-4" /> },
];

const CategoryFiltersSheet: React.FC<CategoryFiltersSheetProps> = ({
  open,
  onClose,
  maxDistance,
  setMaxDistance,
  maxDuration,
  setMaxDuration,
  aroundMeCount,
  setAroundMeCount,
  showMultiDirections,
  setShowMultiDirections,
  distanceUnit,
  setDistanceUnit,
  transportMode,
  setTransportMode
}) => {
  const { t } = useTranslation();

  // Get the appropriate max value for distance slider based on unit
  const getMaxDistanceValue = () => {
    return distanceUnit === 'km' ? 20 : 12; // 20 km or 12 miles
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[90%] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('common.filters')}</SheetTitle>
          <SheetClose className="absolute right-4 top-4" />
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Transport Mode Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('filters.transportMode')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {transportModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={transportMode === mode.id ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2 justify-start",
                    transportMode === mode.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setTransportMode(mode.id)}
                >
                  {mode.icon}
                  <span>{mode.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Distance Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('filters.distance')}</h3>
              <RadioGroup 
                value={distanceUnit} 
                onValueChange={(value: 'km' | 'mi') => setDistanceUnit(value)}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="km" id="sheet-km" className="h-3 w-3" />
                  <Label htmlFor="sheet-km" className="ml-1 text-xs">km</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="mi" id="sheet-mi" className="h-3 w-3" />
                  <Label htmlFor="sheet-mi" className="ml-1 text-xs">mi</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                value={[maxDistance]}
                min={1}
                max={getMaxDistanceValue()}
                step={1}
                onValueChange={(values) => setMaxDistance(values[0])}
              />
              <span className="text-sm font-medium min-w-[50px] text-right">{maxDistance} {distanceUnit}</span>
            </div>
          </div>

          {/* Duration Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('filters.duration')}</h3>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                value={[maxDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(values) => setMaxDuration(values[0])}
              />
              <span className="text-sm font-medium min-w-[50px] text-right">{maxDuration} min</span>
            </div>
          </div>

          {/* Around Me Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('filters.aroundMe')}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('filters.numberOfPlaces')}</span>
              <div className="flex items-center gap-2">
                <Slider
                  className="w-32"
                  value={[aroundMeCount]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(values) => setAroundMeCount(values[0])}
                />
                <span className="text-sm font-medium min-w-[40px] text-right">{aroundMeCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="multi-directions-sheet" className="text-sm">
                {t('filters.multiDirections')}
              </Label>
              <Switch 
                id="multi-directions-sheet" 
                checked={showMultiDirections}
                onCheckedChange={setShowMultiDirections}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryFiltersSheet;
