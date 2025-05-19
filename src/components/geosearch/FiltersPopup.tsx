
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { transportModes } from '@/lib/data/transportModes';
import { categories } from '@/lib/data/categories';
import { X } from 'lucide-react';
import { TransportMode } from '@/types';
import { GeoSearchFilters } from '@/types/geosearch';

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
  const [localFilters, setLocalFilters] = React.useState<GeoSearchFilters>({
    category: filters.category || '',
    subcategory: filters.subcategory || '',
    transport: filters.transport,
    distance: filters.distance,
    unit: filters.unit
  });

  const handleChange = (key: keyof GeoSearchFilters, value: any) => {
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
    <div className="fixed inset-0 bg-black/20 z-20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filtres de recherche</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select 
              value={localFilters.category || ''} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
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
            <Label>Mode de transport</Label>
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
              <Label>Distance maximale</Label>
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
                <Label htmlFor="km" className="text-sm">Kilomètres</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="mi" id="mi" />
                <Label htmlFor="mi" className="text-sm">Miles</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Appliquer</Button>
        </div>
      </Card>
    </div>
  );
};

export default FiltersPopup;
