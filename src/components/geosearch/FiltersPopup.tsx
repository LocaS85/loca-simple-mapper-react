
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { transportModes } from '@/lib/data/transportModes';
import { categories } from '@/lib/data/categories';
import { Compass, X } from 'lucide-react';
import { TransportMode } from '@/types';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface FiltersPopupProps {
  filters: GeoSearchFilters;
  onChange: (filters: Partial<GeoSearchFilters>) => void;
  onClose: () => void;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  filters,
  onChange,
  onClose
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
    <div className="fixed inset-0 bg-black/20 z-20 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{t('geosearch.searchFilters')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Category */}
          <div className="space-y-2">
            <Label>{t('filters.category')}</Label>
            <Select 
              value={localFilters.category || ''} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
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
          <div className="space-y-2">
            <Label>{t('filters.transport')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {transportModes.map(mode => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    type="button"
                    variant={localFilters.transport === mode.value ? "default" : "outline"}
                    className="flex flex-col h-auto py-2 px-1"
                    onClick={() => handleChange('transport', mode.value as TransportMode)}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{mode.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>{t('filters.maxDistance')}</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {localFilters.distance} {localFilters.unit}
                </span>
              </div>
            </div>
            
            <Slider 
              value={[localFilters.distance]} 
              min={1}
              max={getMaxDistanceValue()}
              step={1}
              onValueChange={values => handleChange('distance', values[0])}
              className="mb-2"
            />
            
            <RadioGroup 
              value={localFilters.unit} 
              onValueChange={(value: 'km' | 'mi') => handleChange('unit', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="km" id="km" />
                <Label htmlFor="km" className="text-sm">{t('map.kilometers')}</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="mi" id="mi" />
                <Label htmlFor="mi" className="text-sm">{t('map.miles')}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Around Me section */}
          <div className="space-y-3 border-t pt-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600" />
              <Label className="font-medium">{t('filters.aroundMe')}</Label>
            </div>
            
            <div className="space-y-4">
              {/* Number of places */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('filters.places')}</Label>
                  <span className="text-sm font-medium">{localFilters.aroundMeCount}</span>
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
                <Label>{t('filters.multiDirections')}</Label>
                <Switch 
                  checked={localFilters.showMultiDirections || false}
                  onCheckedChange={(checked) => handleChange('showMultiDirections', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit}>{t('common.apply')}</Button>
        </div>
      </Card>
    </div>
  );
};

export default FiltersPopup;
