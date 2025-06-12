
import React, { useEffect } from 'react';
import { GeoSearchFilters } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';
import { FenetreFiltrageUnifiee } from '../filters';
import { TransportMode, DistanceUnit } from '@/types/map';

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

  // Synchroniser les filtres locaux avec les props
  useEffect(() => {
    setLocalFilters({...filters});
  }, [filters]);

  // Gérer les changements de filtres avec synchronisation immédiate
  const handleFilterChange = (key: keyof GeoSearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Appliquer immédiatement le changement pour synchronisation avec Mapbox
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
    handleFilterChange('unit', value as DistanceUnit);
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

  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <FenetreFiltrageUnifiee
      open={open}
      onClose={onClose}
      category={localFilters.category}
      setCategory={handleCategoryChange}
      subcategory={localFilters.subcategory}
      setSubcategory={handleSubcategoryChange}
      maxDistance={localFilters.distance}
      setMaxDistance={handleMaxDistanceChange}
      maxDuration={localFilters.maxDuration || 20}
      setMaxDuration={handleMaxDurationChange}
      aroundMeCount={localFilters.aroundMeCount || 3}
      setAroundMeCount={handleAroundMeCountChange}
      showMultiDirections={localFilters.showMultiDirections || false}
      setShowMultiDirections={handleShowMultiDirectionsChange}
      distanceUnit={(localFilters.unit || 'km') as 'km' | 'mi'}
      setDistanceUnit={handleDistanceUnitChange}
      transportMode={localFilters.transport}
      setTransportMode={handleTransportModeChange}
      onReset={handleResetFilters}
    />
  );
};

export default FiltersPopup;
