
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, List, Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SearchResult } from '@/types/geosearch';

interface ResultsDisplayProps {
  results: SearchResult[];
  viewMode: 'grid' | 'list' | 'map';
  onViewModeChange: (mode: 'grid' | 'list' | 'map') => void;
  isLoading: boolean;
  onResultClick?: (result: SearchResult) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  viewMode,
  onViewModeChange,
  isLoading,
  onResultClick
}) => {
  const { t } = useTranslation();

  const viewModes = [
    { id: 'grid' as const, icon: Grid, label: t('display.grid') },
    { id: 'list' as const, icon: List, label: t('display.list') },
    { id: 'map' as const, icon: Map, label: t('display.map') }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="flex gap-2">
            {viewModes.map((mode) => (
              <div key={mode.id} className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec sélecteur de vue */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {t('search.results')} ({results.length})
          </h2>
          {results.length > 0 && (
            <Badge variant="secondary">
              {t('search.found', { count: results.length })}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(mode.id)}
                className={cn(
                  "text-xs px-3",
                  viewMode === mode.id && "bg-white shadow-sm"
                )}
              >
                <Icon className="h-3 w-3 mr-1" />
                {mode.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Affichage des résultats selon le mode */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('search.noResults')}
          </h3>
          <p className="text-gray-600">
            {t('search.noResultsDesc')}
          </p>
        </div>
      ) : (
        <div className={cn(
          "gap-4",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          viewMode === 'list' && "space-y-3"
        )}>
          {results.map((result) => (
            <Card 
              key={result.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                viewMode === 'list' && "flex items-center p-4"
              )}
              onClick={() => onResultClick?.(result)}
            >
              {viewMode === 'list' ? (
                <div className="flex-1 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{result.name}</h3>
                    <p className="text-sm text-gray-600">{result.address}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline">{result.category}</Badge>
                    <p className="text-sm text-gray-600">
                      {result.distance.toFixed(1)} km
                      {result.duration && ` • ${result.duration} min`}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-start justify-between">
                      <span>{result.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{result.address}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-primary font-medium">
                        {result.distance.toFixed(1)} km
                      </span>
                      {result.duration && (
                        <span className="text-gray-600">
                          {result.duration} min
                        </span>
                      )}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
