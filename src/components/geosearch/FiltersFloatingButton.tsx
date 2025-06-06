
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GeoSearchFilters } from '@/types/geosearch';
import { FenetreFiltrageUnifiee } from '../filters';
import { TransportMode } from '@/lib/data/transportModes';

interface FiltersFloatingButtonProps {
  filters: GeoSearchFilters;
  onChange: (filters: Partial<GeoSearchFilters>) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

const FiltersFloatingButton: React.FC<FiltersFloatingButtonProps> = ({
  filters,
  onChange,
  onReset,
  isLoading = false
}) => {
  const [open, setOpen] = React.useState(false);

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10;

  const handleFilterChange = (key: keyof GeoSearchFilters, value: any) => {
    onChange({ [key]: value });
  };

  const handleMaxDistanceChange = (value: number) => {
    handleFilterChange('distance', value);
  };

  const handleTransportModeChange = (value: TransportMode) => {
    handleFilterChange('transport', value);
  };

  const handleAroundMeCountChange = (value: number) => {
    handleFilterChange('aroundMeCount', value);
  };

  const handleShowMultiDirectionsChange = (value: boolean) => {
    handleFilterChange('showMultiDirections', value);
  };

  const handleDistanceUnitChange = (value: 'km' | 'mi') => {
    handleFilterChange('unit', value);
  };

  const handleMaxDurationChange = (value: number) => {
    handleFilterChange('maxDuration', value);
  };

  const handleCategoryChange = (value: string | null) => {
    handleFilterChange('category', value);
  };

  const handleSubcategoryChange = (value: string | null) => {
    handleFilterChange('subcategory', value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="icon"
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-md hover:bg-gray-50 relative"
          disabled={isLoading}
          title="Filtres de recherche"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" side="left">
        <FenetreFiltrageUnifiee
          open={true}
          onClose={() => setOpen(false)}
          category={filters.category}
          setCategory={(value) => onChange({ category: value })}
          subcategory={filters.subcategory}
          setSubcategory={(value) => onChange({ subcategory: value })}
          maxDistance={filters.distance}
          setMaxDistance={(value) => onChange({ distance: value })}
          maxDuration={filters.maxDuration}
          setMaxDuration={(value) => onChange({ maxDuration: value })}
          aroundMeCount={filters.aroundMeCount}
          setAroundMeCount={(value) => onChange({ aroundMeCount: value })}
          showMultiDirections={filters.showMultiDirections}
          setShowMultiDirections={(value) => onChange({ showMultiDirections: value })}
          distanceUnit={filters.unit}
          setDistanceUnit={(value) => onChange({ unit: value })}
          transportMode={filters.transport}
          setTransportMode={(value: TransportMode) => onChange({ transport: value })}
          onReset={onReset}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FiltersFloatingButton;
