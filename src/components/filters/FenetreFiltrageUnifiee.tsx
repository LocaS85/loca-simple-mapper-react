
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, User, Bike, Bus, Compass, Route, Filter, RefreshCw } from 'lucide-react';
import { TransportMode } from '@/lib/data/transportModes';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface FenetreFiltrageUnifieeProps {
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
  category: string | null;
  setCategory: (category: string | null) => void;
  subcategory: string | null;
  setSubcategory: (subcategory: string | null) => void;
  onReset?: () => void;
}

const modesDeTansport = [
  { id: 'car' as TransportMode, name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'walking' as TransportMode, name: 'À pied', icon: <User className="h-4 w-4" /> },
  { id: 'cycling' as TransportMode, name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'bus' as TransportMode, name: 'Transport', icon: <Bus className="h-4 w-4" /> },
];

// Catégories disponibles pour les filtres
const categoriesDisponibles = [
  { id: 'restaurant', name: 'Restaurants' },
  { id: 'hotel', name: 'Hôtels' },
  { id: 'gas_station', name: 'Stations-service' },
  { id: 'hospital', name: 'Hôpitaux' },
  { id: 'pharmacy', name: 'Pharmacies' },
  { id: 'bank', name: 'Banques' },
  { id: 'supermarket', name: 'Supermarchés' },
  { id: 'shopping_mall', name: 'Centres commerciaux' },
  { id: 'tourist_attraction', name: 'Attractions touristiques' },
  { id: 'park', name: 'Parcs' }
];

const FenetreFiltrageUnifiee: React.FC<FenetreFiltrageUnifieeProps> = ({
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
  setTransportMode,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  onReset
}) => {
  const { t } = useTranslation();

  // Obtenir la valeur maximale appropriée pour le curseur de distance en fonction de l'unité
  const getMaxDistanceValue = () => {
    return distanceUnit === 'km' ? 20 : 12; // 20 km ou 12 miles
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[90%] sm:w-[450px] overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <SheetTitle>{t('common.filters')}</SheetTitle>
          </div>
          {onReset && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset} 
              className="flex items-center gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              {t('common.reset')}
            </Button>
          )}
          <SheetClose className="absolute right-4 top-4" />
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Section Catégorie */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('filters.category')}</h3>
            <Select 
              value={category || ''} 
              onValueChange={(value) => setCategory(value || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('categories.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('categories.allCategories')}
                </SelectItem>
                {categoriesDisponibles.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Mode de Transport */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('filters.transportMode')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {modesDeTansport.map((mode) => (
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

          {/* Section Distance */}
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

          {/* Section Durée */}
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

          {/* Section Autour de Moi */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('filters.aroundMe')}</h3>
            </div>
            
            <div className="space-y-5">
              {/* Nombre de lieux */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('filters.places')}</Label>
                  <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">
                    {aroundMeCount}
                  </span>
                </div>
                <Slider 
                  value={[aroundMeCount]} 
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={values => setAroundMeCount(values[0])}
                />
              </div>
              
              {/* Multi-directions toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  <Label>{t('filters.multiDirections')}</Label>
                </div>
                <Switch 
                  checked={showMultiDirections}
                  onCheckedChange={setShowMultiDirections}
                />
              </div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t mt-6">
          <div className="flex justify-between w-full gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button onClick={onClose} className="flex-1">
              {t('common.apply')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FenetreFiltrageUnifiee;
