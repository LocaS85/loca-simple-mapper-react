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

  // Calculer le nombre de filtres actifs avec les bonnes valeurs par défaut
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
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "relative h-10 w-10 rounded-lg border-2 transition-all duration-200",
        hasActiveFilters 
          ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" 
          : "border-border bg-background hover:bg-muted"
      )}
      aria-label={`${t('common.filters')} (${activeFiltersCount} actifs)`}
    >
      <Filter className="h-5 w-5" />
      {hasActiveFilters && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs font-medium flex items-center justify-center shadow-sm">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );
};

export default OptimizedFilterButton;