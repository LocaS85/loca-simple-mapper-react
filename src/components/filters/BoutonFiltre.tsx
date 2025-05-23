
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
}

const BoutonFiltre: React.FC<BoutonFiltreProps> = ({
  onClick,
  active = false,
  transportMode = 'walking',
  distanceChanged = false,
  durationChanged = false,
  aroundMeChanged = false,
  showMultiDirections = false
}) => {
  const { t } = useTranslation();

  // Vérifier si un filtre est appliqué
  const isFiltersApplied = 
    transportMode !== 'walking' || 
    distanceChanged || 
    durationChanged || 
    aroundMeChanged || 
    showMultiDirections;

  return (
    <Button 
      variant={isFiltersApplied ? "default" : "outline"}
      onClick={onClick}
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
  );
};

export default BoutonFiltre;
