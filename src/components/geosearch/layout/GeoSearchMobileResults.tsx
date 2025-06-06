
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';
import { SearchResult } from '@/types/geosearch';

interface GeoSearchMobileResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  showResults: boolean;
  isResultsExpanded: boolean;
  statusInfo: {
    totalResults: number;
  };
  onToggleExpanded: () => void;
}

export const GeoSearchMobileResults: React.FC<GeoSearchMobileResultsProps> = ({
  results,
  isLoading,
  showResults,
  isResultsExpanded,
  statusInfo,
  onToggleExpanded
}) => {
  if (!showResults) return null;

  return (
    <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-xl shadow-2xl border-t transition-all duration-300 ${
      isResultsExpanded ? 'h-3/4' : 'h-48'
    }`}>
      <div 
        className="p-3 sm:p-4 border-b bg-gray-50 cursor-pointer"
        onClick={onToggleExpanded}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base">
            Résultats trouvés
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {statusInfo.totalResults}
            </Badge>
            {isResultsExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4">
            <EnhancedResultsList
              results={results}
              isLoading={isLoading}
              onNavigate={(coords) => {
                console.log('Navigate to:', coords);
              }}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
