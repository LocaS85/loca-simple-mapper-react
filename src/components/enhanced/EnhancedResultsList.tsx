
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { SearchResult } from '@/types/geosearch';
import EnhancedResultCard from './EnhancedResultCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

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
  height?: number;
  virtualizeResults?: boolean;
}

// Composant mémoïsé pour la virtualisation
const VirtualizedResultItem = memo<{
  index: number;
  style: React.CSSProperties;
  data: {
    results: SearchResult[];
    onResultClick?: (result: SearchResult) => void;
    selectedResultId?: string;
  };
}>(({ index, style, data }) => {
  const result = data.results[index];
  
  return (
    <div style={style} className="px-2 py-1">
      <EnhancedResultCard
        result={result}
        onSelect={data.onResultClick}
        isSelected={data.selectedResultId === result.id}
      />
    </div>
  );
});

VirtualizedResultItem.displayName = 'VirtualizedResultItem';

const EnhancedResultsList: React.FC<EnhancedResultsListProps> = ({
  results,
  onResultSelect,
  onNavigate,
  onResultClick,
  selectedResultId,
  className = "",
  isLoading = false,
  height = 400,
  virtualizeResults = false
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

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const itemData = useMemo(() => ({
    results,
    onResultClick: handleResultClick,
    selectedResultId
  }), [results, handleResultClick, selectedResultId]);

  if (!results || results.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 text-gray-500 ${className}`}>
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg mb-2">Aucun résultat trouvé</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    );
  }

  // Mode virtualisé pour de nombreux résultats
  if (virtualizeResults && results.length > 20) {
    return (
      <div className={`w-full ${className}`}>
        <List
          height={height}
          width="100%"
          itemCount={results.length}
          itemSize={120}
          itemData={itemData}
          className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          {VirtualizedResultItem}
        </List>
      </div>
    );
  }

  // Mode standard avec ScrollArea
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
