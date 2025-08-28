import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';
import { GeoSearchFilters } from '@/types/geosearch';

interface OptimizedFilterButtonProps {
  onClick: () => void;
  filters: GeoSearchFilters;
  distanceMode: 'distance' | 'duration';
}

const OptimizedFilterButton: React.FC<OptimizedFilterButtonProps> = ({
  onClick,
  filters,
  distanceMode
}) => {
  const { t } = useTranslation();

  // Calculer le nombre de filtres actifs
  const activeFiltersCount = [
    filters.transport !== 'walking',
    filters.category !== null,
    distanceMode === 'distance' ? (filters.distance !== 5 || filters.unit !== 'km') : (filters.maxDuration !== 30),
    filters.aroundMeCount !== 10,
    filters.showMultiDirections
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Button 
      variant={hasActiveFilters ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 relative",
        hasActiveFilters && "bg-primary text-primary-foreground"
      )}
      aria-label={`${t('common.filters')} (${activeFiltersCount} actifs)`}
    >
      <Filter className="h-4 w-4" />
      <span>{t('common.filters')}</span>
      {hasActiveFilters && (
        <>
          <span className="bg-background text-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center font-medium">
            {activeFiltersCount}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        </>
      )}
    </Button>
  );
};

export default OptimizedFilterButton;