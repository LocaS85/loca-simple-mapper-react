
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import FiltersFloatingButton from './FiltersFloatingButton';
import PrintButton from './PrintButton';

interface FloatingControlsProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  isLoading: boolean;
  updateFilters: (filters: Partial<GeoSearchFilters>) => void;
  resetFilters: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  filters,
  results,
  isLoading,
  updateFilters,
  resetFilters
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-2">
        <FiltersFloatingButton
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          isLoading={isLoading}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          disabled={isLoading}
          title="Réinitialiser les filtres"
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
        
        <PrintButton results={results} />
      </div>
    </div>
  );
};

export default FloatingControls;
