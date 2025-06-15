
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Loader2 } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import EnhancedResultCard from './EnhancedResultCard';

interface EnhancedResultsListProps {
  results: SearchResult[];
  isLoading?: boolean;
  onNavigate?: (coordinates: [number, number]) => void;
  onSelect?: (result: SearchResult) => void;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  maxHeight?: string;
  userLocation?: [number, number] | null;
  transportMode?: string;
}

const EnhancedResultsList: React.FC<EnhancedResultsListProps> = ({
  results,
  isLoading = false,
  onNavigate,
  onSelect,
  onResultClick,
  className = '',
  maxHeight = '600px',
  userLocation,
  transportMode
}) => {
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    onSelect?.(result);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Aucun résultat trouvé. Essayez de modifier vos critères de recherche.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
        </h3>
      </div>
      
      <ScrollArea style={{ maxHeight }} className="pr-4">
        <div className="space-y-3">
          {results.map((result) => (
            <EnhancedResultCard
              key={result.id}
              result={result}
              onNavigate={onNavigate}
              onSelect={handleResultClick}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnhancedResultsList;
