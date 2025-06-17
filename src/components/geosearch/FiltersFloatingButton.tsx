
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GeoSearchFilters } from '@/types/geosearch';
import { FenetreFiltrageUnifiee } from '../filters';
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
          size="sm"
          className={`
            h-7 w-7 p-0 flex-shrink-0 relative z-40
            border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors rounded-sm
            ${hasActiveFilters ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' : 'bg-white'}
          `}
          disabled={isLoading}
          title="Filtres de recherche"
        >
          <SlidersHorizontal className="h-3 w-3" />
          {hasActiveFilters && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-80 z-50 ${isMobile ? 'w-screen max-w-sm mx-2' : ''}`} 
        align={isMobile ? "center" : "end"} 
        side={isMobile ? "top" : "left"}
        sideOffset={isMobile ? 15 : 5}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <FenetreFiltrageUnifiee
          open={true}
          onClose={() => setOpen(false)}
          category={filters.category}
          setCategory={(value) => onChange({ category: value })}
          subcategory={filters.subcategory}
          setSubcategory={(value) => onChange({ subcategory: value })}
          maxDistance={filters.distance}
          setMaxDistance={(value) => onChange({ distance: value })}
          maxDuration={filters.maxDuration || 20}
          setMaxDuration={(value) => onChange({ maxDuration: value })}
          aroundMeCount={filters.aroundMeCount || 3}
          setAroundMeCount={(value) => onChange({ aroundMeCount: value })}
          showMultiDirections={filters.showMultiDirections || false}
          setShowMultiDirections={(value) => onChange({ showMultiDirections: value })}
          distanceUnit={(filters.unit || 'km') as 'km' | 'mi'}
          setDistanceUnit={(value) => onChange({ unit: value })}
          transportMode={filters.transport}
          setTransportMode={(value) => onChange({ transport: value })}
          onReset={onReset}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FiltersFloatingButton;
