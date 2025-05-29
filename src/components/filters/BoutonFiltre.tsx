
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';

interface BoutonFiltreProps {
  onClick: () => void;
  active?: boolean;
  transportMode?: TransportMode;
  distanceChanged?: boolean;
  durationChanged?: boolean;
  aroundMeChanged?: boolean;
  showMultiDirections?: boolean;
  categoryChanged?: boolean;
  queryChanged?: boolean;
}

const BoutonFiltre: React.FC<BoutonFiltreProps> = ({
  onClick,
  active = false,
  transportMode = 'walking',
  distanceChanged = false,
  durationChanged = false,
  aroundMeChanged = false,
  showMultiDirections = false,
  categoryChanged = false,
  queryChanged = false
}) => {
  const { t } = useTranslation();

  // Vérifier si des filtres sont appliqués
  const isFiltersApplied = 
    transportMode !== 'walking' || 
    distanceChanged || 
    durationChanged || 
    aroundMeChanged || 
    showMultiDirections ||
    categoryChanged ||
    queryChanged;

  // Compter le nombre de filtres actifs
  const activeFiltersCount = [
    transportMode !== 'walking',
    distanceChanged,
    durationChanged,
    aroundMeChanged,
    showMultiDirections,
    categoryChanged,
    queryChanged
  ].filter(Boolean).length;

  return (
    <Button 
      variant={isFiltersApplied ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 relative",
        isFiltersApplied && "bg-primary text-primary-foreground"
      )}
      aria-label={t('common.filters')}
    >
      <Filter className="h-4 w-4" />
      <span className="hidden sm:inline">{t('common.filters')}</span>
      {isFiltersApplied && (
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-xs font-bold ml-1">
              {activeFiltersCount}
            </span>
          )}
        </div>
      )}
    </Button>
  );
};

export default BoutonFiltre;
