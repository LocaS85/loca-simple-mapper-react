
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { TransportMode, DistanceUnit } from '@/types/map';
import FilterBadges from '../filters/FilterBadges';

interface CategoryFiltersSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transportMode: TransportMode;
  distance: number;
  distanceUnit: DistanceUnit;
  category?: string;
  subcategory?: string;
}

const CategoryFiltersSheet: React.FC<CategoryFiltersSheetProps> = ({
  isOpen,
  onOpenChange,
  transportMode,
  distance,
  distanceUnit,
  category,
  subcategory
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Filtres
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres actifs</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FilterBadges
            transportMode={transportMode}
            distance={distance}
            distanceUnit={distanceUnit}
            category={category}
            subcategory={subcategory}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryFiltersSheet;
