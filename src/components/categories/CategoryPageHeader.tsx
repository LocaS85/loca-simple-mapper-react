
import React, { useState } from 'react';
import { MapToggle } from '@/components/categories';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';
import UnifiedFilterSheet from '../filters/UnifiedFilterSheet';
import FilterButton from '../filters/FilterButton';
import RouteBackButton from '@/components/ui/RouteBackButton';

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
  onResetFilters?: () => void;
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
  setTransportMode,
  onResetFilters
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <div className="mb-6">
        <RouteBackButton className="mb-4" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Catégories</h1>
          <div className="flex items-center gap-2">
            <FilterButton 
              onClick={() => setShowFilters(true)}
              transportMode={transportMode}
              distanceChanged={maxDistance !== 5}
              durationChanged={maxDuration !== 20}
              aroundMeChanged={(aroundMeCount || 3) > 3}
              showMultiDirections={showMultiDirections}
            />
            <MapToggle showMap={showMap} setShowMap={setShowMap} />
          </div>
        </div>
      </div>

      <UnifiedFilterSheet
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
        onReset={onResetFilters}
      />
    </>
  );
};

export default CategoryPageHeader;
