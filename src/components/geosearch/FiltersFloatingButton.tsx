
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
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white relative"
          disabled={isLoading}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtres
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" side="bottom">
        <FenetreFiltrageUnifiee
          open={true}
          onClose={() => setOpen(false)}
          category={filters.category}
          setCategory={handleCategoryChange}
          subcategory={filters.subcategory}
          setSubcategory={handleSubcategoryChange}
          maxDistance={filters.distance}
          setMaxDistance={handleMaxDistanceChange}
          maxDuration={filters.maxDuration}
          setMaxDuration={handleMaxDurationChange}
          aroundMeCount={filters.aroundMeCount}
          setAroundMeCount={handleAroundMeCountChange}
          showMultiDirections={filters.showMultiDirections}
          setShowMultiDirections={handleShowMultiDirectionsChange}
          distanceUnit={filters.unit}
          setDistanceUnit={handleDistanceUnitChange}
          transportMode={filters.transport}
          setTransportMode={handleTransportModeChange}
          onReset={onReset}
          isPopover={true}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FiltersFloatingButton;
