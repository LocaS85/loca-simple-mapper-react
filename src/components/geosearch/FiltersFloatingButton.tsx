
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GeoSearchFilters } from '@/types/geosearch';
import { FenetreFiltrageUnifiee } from '../filters';
import { TransportMode } from '@/lib/data/transportModes';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const hasActiveFilters = 
    filters.category || 
    filters.transport !== 'walking' || 
    filters.distance !== 10;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="icon"
          className={`
            ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
            bg-white shadow-md hover:bg-gray-50 border border-gray-300 relative
            ${hasActiveFilters ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' : ''}
          `}
          disabled={isLoading}
          title="Filtres de recherche"
        >
          <SlidersHorizontal className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
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
