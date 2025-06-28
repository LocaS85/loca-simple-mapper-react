
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult, GeoSearchFilters } from '@/types/geosearch';

interface GeoSearchSidebarPopupProps {
  open: boolean;
  onClose: () => void;
  results: SearchResult[];
  isLoading: boolean;
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
}

const GeoSearchSidebarPopup: React.FC<GeoSearchSidebarPopupProps> = ({
  open,
  onClose,
  results,
  isLoading,
  filters,
  onFiltersChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Options et résultats</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {isLoading ? 'Recherche en cours...' : `${results.length} résultats trouvés`}
            </div>
            
            {results.map((result, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h4 className="font-medium">{result.name}</h4>
                <p className="text-sm text-gray-600">{result.address}</p>
                {result.distance && (
                  <p className="text-xs text-gray-500 mt-1">
                    {result.distance.toFixed(1)} km
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GeoSearchSidebarPopup;
