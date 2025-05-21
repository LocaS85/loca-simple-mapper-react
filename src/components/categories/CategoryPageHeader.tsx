
import React, { useState } from 'react';
import { MapToggle } from '@/components/categories';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TransportMode } from '@/lib/data/transportModes';
import CategoryFiltersSheet from './CategoryFiltersSheet';

interface CategoryPageHeaderProps {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
  aroundMeCount?: number;
  setAroundMeCount?: (count: number) => void;
  showMultiDirections?: boolean;
  setShowMultiDirections?: (show: boolean) => void;
  distanceUnit?: 'km' | 'mi';
  setDistanceUnit?: (unit: 'km' | 'mi') => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  showMap,
  setShowMap,
  maxDistance,
  setMaxDistance,
  maxDuration,
  setMaxDuration,
  aroundMeCount = 3,
  setAroundMeCount,
  showMultiDirections = false,
  setShowMultiDirections,
  distanceUnit = 'km',
  setDistanceUnit,
  transportMode,
  setTransportMode
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);

  // Check if filters are applied (for highlighting the filter button)
  const isFiltersApplied = Boolean(
    maxDistance !== 5 || 
    maxDuration !== 20 || 
    aroundMeCount > 3 || 
    showMultiDirections ||
    transportMode !== 'walking'
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t('common.categories')}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant={isFiltersApplied ? "default" : "outline"}
            onClick={() => setShowFilters(true)}
            className={cn(
              "flex items-center gap-2",
              isFiltersApplied && "bg-primary text-primary-foreground"
            )}
            aria-label={t('common.filters')}
          >
            <Filter className="h-4 w-4" />
            <span>{t('common.filters')}</span>
            {isFiltersApplied && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </Button>
          <MapToggle showMap={showMap} setShowMap={setShowMap} />
        </div>
      </div>

      <CategoryFiltersSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        maxDuration={maxDuration}
        setMaxDuration={setMaxDuration}
        aroundMeCount={aroundMeCount || 3}
        setAroundMeCount={setAroundMeCount || (() => {})}
        showMultiDirections={showMultiDirections || false}
        setShowMultiDirections={setShowMultiDirections || (() => {})}
        distanceUnit={distanceUnit || 'km'}
        setDistanceUnit={setDistanceUnit || (() => {})}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
      />
    </>
  );
};

export default CategoryPageHeader;
