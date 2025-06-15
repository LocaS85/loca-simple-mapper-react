
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import EnhancedResultsList from '../../enhanced/EnhancedResultsList';

interface GeoSearchMobilePanelProps {
  results: SearchResult[];
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onResultSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
}

const GeoSearchMobilePanel: React.FC<GeoSearchMobilePanelProps> = ({
  results,
  isLoading,
  isOpen,
  onToggle,
  onResultSelect
}) => {
  if (results.length === 0 && !isLoading) return null;

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-xl shadow-2xl border-t transition-all duration-300 ${
        isOpen ? 'h-3/4' : 'h-48'
      }`}
    >
      {/* Handle et header */}
      <div 
        className="p-4 border-b bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Résultats trouvés
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {results.length}
            </Badge>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <EnhancedResultsList
              results={results}
              isLoading={isLoading}
              onResultClick={(result) => {
                onResultSelect({
                  name: result.name,
                  coordinates: result.coordinates,
                  placeName: result.address || result.name
                });
              }}
              className="border-0 shadow-none"
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GeoSearchMobilePanel;
