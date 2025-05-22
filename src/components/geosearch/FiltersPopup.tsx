
import React from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';
import UnifiedFilterSheet from '../filters/UnifiedFilterSheet';

interface FiltersPopupProps {
  filters: GeoSearchFilters;
  onChange: (filters: Partial<GeoSearchFilters>) => void;
  onClose: () => void;
  open: boolean;
  onReset?: () => void;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  filters,
  onChange,
  onClose,
  open,
  onReset
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = React.useState<GeoSearchFilters>({
    ...filters
  });

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters({...filters});
  }, [filters]);

  // Handle filter changes
  const handleMaxDistanceChange = (value: number) => {
    setLocalFilters(prev => ({ ...prev, distance: value }));
    onChange({ distance: value });
  };

  const handleTransportModeChange = (value: any) => {
    setLocalFilters(prev => ({ ...prev, transport: value }));
    onChange({ transport: value });
  };

  const handleAroundMeCountChange = (value: number) => {
    setLocalFilters(prev => ({ ...prev, aroundMeCount: value }));
    onChange({ aroundMeCount: value });
  };

  const handleShowMultiDirectionsChange = (value: boolean) => {
    setLocalFilters(prev => ({ ...prev, showMultiDirections: value }));
    onChange({ showMultiDirections: value });
  };

  const handleDistanceUnitChange = (value: 'km' | 'mi') => {
    setLocalFilters(prev => ({ ...prev, unit: value }));
    onChange({ unit: value });
  };

  // For GeoSearch the duration isn't used directly but we'll store it for consistency
  const handleMaxDurationChange = (value: number) => {
    setLocalFilters(prev => ({ ...prev, maxDuration: value }));
  };

  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <UnifiedFilterSheet
      open={open}
      onClose={onClose}
      maxDistance={localFilters.distance}
      setMaxDistance={handleMaxDistanceChange}
      maxDuration={localFilters.maxDuration || 20}
      setMaxDuration={handleMaxDurationChange}
      aroundMeCount={localFilters.aroundMeCount}
      setAroundMeCount={handleAroundMeCountChange}
      showMultiDirections={localFilters.showMultiDirections}
      setShowMultiDirections={handleShowMultiDirectionsChange}
      distanceUnit={localFilters.unit}
      setDistanceUnit={handleDistanceUnitChange}
      transportMode={localFilters.transport}
      setTransportMode={handleTransportModeChange}
      onReset={handleResetFilters}
    />
  );
};

export default FiltersPopup;
