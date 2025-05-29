
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { UnifiedFilters } from '@/hooks/useUnifiedFilters';

interface FilterIntegrationProps {
  filters: UnifiedFilters;
  onToggleFilters: () => void;
  onResetFilters: () => void;
  showFilters: boolean;
  resultsCount: number;
  isLoading: boolean;
}

const FilterIntegration: React.FC<FilterIntegrationProps> = ({
  filters,
  onToggleFilters,
  onResetFilters,
  showFilters,
  resultsCount,
  isLoading
}) => {
  const { t } = useTranslation();

  // Compter les filtres actifs
  const activeFiltersCount = [
    filters.category,
    filters.subcategory,
    filters.transport !== 'walking',
    filters.distance !== 10,
    filters.maxDuration !== 20,
    filters.unit !== 'km',
    filters.aroundMeCount !== 3,
    filters.showMultiDirections
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3">
      {/* En-tête des filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">{t('filters.title')}</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              "text-xs",
              showFilters && "bg-primary/10 text-primary"
            )}
          >
            {showFilters ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showFilters ? t('common.hide') : t('common.show')}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-xs"
            >
              {t('common.reset')}
            </Button>
          )}
        </div>
      </div>

      {/* Badges des filtres actifs */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="outline" className="text-xs">
                {filters.category}
              </Badge>
            )}
            {filters.subcategory && (
              <Badge variant="outline" className="text-xs">
                {filters.subcategory}
              </Badge>
            )}
            {filters.transport !== 'walking' && (
              <Badge variant="outline" className="text-xs">
                {t(`filters.transportModes.${filters.transport}`)}
              </Badge>
            )}
            {filters.distance !== 10 && (
              <Badge variant="outline" className="text-xs">
                {filters.distance} {filters.unit}
              </Badge>
            )}
            {filters.maxDuration !== 20 && (
              <Badge variant="outline" className="text-xs">
                {filters.maxDuration} min
              </Badge>
            )}
          </div>
        </>
      )}

      {/* Résumé des résultats */}
      <Separator />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
              {t('common.loading')}
            </span>
          ) : (
            t('search.resultsCount', { count: resultsCount })
          )}
        </span>
        
        {!isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className="text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            {t('filters.adjust')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterIntegration;
