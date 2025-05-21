
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { transportModes } from '@/lib/data/transportModes';
import { categories } from '@/lib/data/categories';
import { Compass, Map, Navigation } from 'lucide-react';
import { TransportMode } from '@/types';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface FiltersPopupProps {
  filters: GeoSearchFilters;
  onChange: (filters: Partial<GeoSearchFilters>) => void;
  onClose: () => void;
  open: boolean;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  filters,
  onChange,
  onClose,
  open
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = React.useState<GeoSearchFilters & { 
    aroundMeCount?: number;
    showMultiDirections?: boolean;
  }>({
    category: filters.category || '',
    subcategory: filters.subcategory || '',
    transport: filters.transport,
    distance: filters.distance,
    unit: filters.unit,
    aroundMeCount: filters.aroundMeCount || 3,
    showMultiDirections: filters.showMultiDirections || false
  });

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters({
      category: filters.category || '',
      subcategory: filters.subcategory || '',
      transport: filters.transport,
      distance: filters.distance,
      unit: filters.unit,
      aroundMeCount: filters.aroundMeCount || 3,
      showMultiDirections: filters.showMultiDirections || false
    });
  }, [filters]);

  const handleChange = (key: keyof typeof localFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onChange(localFilters);
    onClose();
  };

  // Get the max value for distance slider based on unit
  const getMaxDistanceValue = () => {
    return localFilters.unit === 'km' ? 50 : 30; // 50 km or 30 miles
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-5">
          <SheetTitle>{t('geosearch.searchFilters')}</SheetTitle>
          <SheetDescription>
            {t('geosearch.modifyFilters')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 overflow-y-auto pb-10">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-base">{t('filters.category')}</Label>
            <Select 
              value={localFilters.category || ''} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('categories.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Transport mode */}
          <div className="space-y-3">
            <Label className="text-base">{t('filters.transport')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {transportModes.map(mode => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    type="button"
                    variant={localFilters.transport === mode.value ? "default" : "outline"}
                    className="flex flex-col h-auto py-3 px-2"
                    onClick={() => handleChange('transport', mode.value as TransportMode)}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{t(`filters.transportModes.${mode.value}`)}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base">{t('filters.maxDistance')}</Label>
              <div className="px-2 py-1 bg-secondary rounded text-sm font-medium">
                {localFilters.distance} {localFilters.unit}
              </div>
            </div>
            
            <Slider 
              value={[localFilters.distance]} 
              min={1}
              max={getMaxDistanceValue()}
              step={1}
              onValueChange={values => handleChange('distance', values[0])}
              className="mb-4"
            />
            
            <RadioGroup 
              value={localFilters.unit} 
              onValueChange={(value: 'km' | 'mi') => handleChange('unit', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="km" id="km" />
                <Label htmlFor="km">{t('map.kilometers')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mi" id="mi" />
                <Label htmlFor="mi">{t('map.miles')}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Around Me section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">{t('filters.aroundMe')}</Label>
            </div>
            
            <div className="space-y-5">
              {/* Number of places */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('filters.places')}</Label>
                  <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">
                    {localFilters.aroundMeCount}
                  </span>
                </div>
                <Slider 
                  value={[localFilters.aroundMeCount || 3]} 
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={values => handleChange('aroundMeCount', values[0])}
                />
              </div>
              
              {/* Multi-directions toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('filters.multiDirections')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('filters.multiDirections')}
                  </p>
                </div>
                <Switch 
                  checked={localFilters.showMultiDirections || false}
                  onCheckedChange={(checked) => handleChange('showMultiDirections', checked)}
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
            <Button onClick={handleSubmit} className="flex-1">
              {t('common.apply')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersPopup;
