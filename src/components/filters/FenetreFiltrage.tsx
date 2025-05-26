
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';
import { Car, User, Bike, Bus } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

export interface FenetreFiltrageProp {
  isOpen?: boolean;
  onClose?: () => void;
}

const FenetreFiltrage: React.FC<FenetreFiltrageProp> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  
  // Utiliser le store Zustand
  const {
    filters,
    showFilters,
    updateFilters,
    resetFilters,
    toggleFilters,
    setShowFilters
  } = useGeoSearchStore();

  // Utiliser les props ou le store
  const isSheetOpen = isOpen !== undefined ? isOpen : showFilters;
  const handleClose = onClose || (() => setShowFilters(false));

  // Convertir entre km et mi
  const convertDistance = (value: number, from: 'km' | 'mi', to: 'km' | 'mi'): number => {
    if (from === to) return value;
    return from === 'km' ? value * 0.621371 : value * 1.60934;
  };

  // Gérer le changement d'unité
  const handleUnitChange = (unit: 'km' | 'mi') => {
    if (unit !== filters.unit) {
      const newDistance = convertDistance(filters.distance, filters.unit, unit);
      updateFilters({
        distance: Math.round(newDistance * 10) / 10,
        unit
      });
    }
  };

  // Associer les modes de transport à leurs icônes
  const transportModeIcons = {
    car: <Car className="h-4 w-4" />,
    walking: <User className="h-4 w-4" />,
    cycling: <Bike className="h-4 w-4" />,
    bus: <Bus className="h-4 w-4" />,
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-[90%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('filters.title')}</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Mode de transport */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('filters.transportMode')}</h3>
            <div className="flex flex-wrap gap-2">
              {(['car', 'walking', 'cycling', 'bus'] as TransportMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={filters.transport === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilters({ transport: mode })}
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
                <span className="font-semibold">{filters.distance}</span>
                <div className="flex rounded-md overflow-hidden border border-border">
                  <button
                    onClick={() => handleUnitChange('km')}
                    className={`px-2 py-1 text-xs ${
                      filters.unit === 'km' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    km
                  </button>
                  <button
                    onClick={() => handleUnitChange('mi')}
                    className={`px-2 py-1 text-xs ${
                      filters.unit === 'mi' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    mi
                  </button>
                </div>
              </div>
            </div>
            <Slider
              value={[filters.distance]}
              min={1}
              max={filters.unit === 'km' ? 50 : 30}
              step={1}
              onValueChange={(values) => updateFilters({ distance: values[0] })}
            />
          </div>

          {/* Nombre "Autour de moi" */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('filters.aroundMeCount')}</h3>
              <span className="font-semibold">{filters.aroundMeCount}</span>
            </div>
            <Slider
              value={[filters.aroundMeCount]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => updateFilters({ aroundMeCount: values[0] })}
            />
          </div>

          {/* Durée maximale */}
          {filters.maxDuration && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{t('filters.maxDuration')}</h3>
                <span className="font-semibold">
                  {filters.maxDuration} {t('common.minutes')}
                </span>
              </div>
              <Slider
                value={[filters.maxDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(values) => updateFilters({ maxDuration: values[0] })}
              />
            </div>
          )}

          {/* Afficher les directions multiples */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('filters.showMultiDirections')}</h3>
            <Button
              variant={filters.showMultiDirections ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ showMultiDirections: !filters.showMultiDirections })}
            >
              {filters.showMultiDirections ? t('common.yes') : t('common.no')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button className="w-full" onClick={handleClose}>
            {t('common.apply')}
          </Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            {t('common.reset')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FenetreFiltrage;
