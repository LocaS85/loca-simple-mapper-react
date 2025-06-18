
import React from 'react';
import { SearchResult } from '@/types/geosearch';
import EnhancedResultCard from './EnhancedResultCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnhancedResultsListProps {
  results: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  onNavigate?: (result: SearchResult) => void;
  onResultClick?: (result: SearchResult) => void;
  selectedResultId?: string;
  className?: string;
  isLoading?: boolean;
  userLocation?: [number, number] | null;
  transportMode?: string;
}

const EnhancedResultsList: React.FC<EnhancedResultsListProps> = ({
  results,
  onResultSelect,
  onNavigate,
  onResultClick,
  selectedResultId,
  className = "",
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">Aucun résultat trouvé</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    );
  }

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else if (onResultSelect) {
      onResultSelect(result);
    }
  };

  return (
    <ScrollArea className={`h-full ${className}`}>
      <div className="space-y-3 p-4">
        {results.map((result) => (
          <EnhancedResultCard
            key={result.id}
            result={result}
            onSelect={handleResultClick}
            onNavigate={onNavigate}
            isSelected={selectedResultId === result.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EnhancedResultsList;
