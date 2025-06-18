
import React from 'react';
import { SearchResult } from '@/types/geosearch';
import EnhancedResultCard from './EnhancedResultCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnhancedResultsListProps {
  results: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  onNavigate?: (result: SearchResult) => void;
  selectedResultId?: string;
  className?: string;
}

const EnhancedResultsList: React.FC<EnhancedResultsListProps> = ({
  results,
  onResultSelect,
  onNavigate,
  selectedResultId,
  className = ""
}) => {
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

  return (
    <ScrollArea className={`h-full ${className}`}>
      <div className="space-y-3 p-4">
        {results.map((result) => (
          <EnhancedResultCard
            key={result.id}
            result={result}
            onSelect={onResultSelect}
            onNavigate={onNavigate}
            isSelected={selectedResultId === result.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EnhancedResultsList;
