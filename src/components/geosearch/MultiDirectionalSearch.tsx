import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MultiDirectionalSearchProps {
  searchOrigin: 'position' | 'address';
  onSearchOriginChange: (origin: 'position' | 'address') => void;
  selectedOriginAddress: any;
  onOriginAddressChange: (address: any) => void;
  userAddresses: any[];
  maxResults: number;
  onMaxResultsChange: (value: number) => void;
  routeCount: number;
}

const MultiDirectionalSearch: React.FC<MultiDirectionalSearchProps> = ({
  searchOrigin,
  onSearchOriginChange,
  selectedOriginAddress,
  onOriginAddressChange,
  userAddresses,
  maxResults,
  onMaxResultsChange,
  routeCount
}) => {
  return (
    <div className="px-4 py-2 bg-primary/10 border-t flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-xs">
          Mode Multi-directions actif
        </Badge>
        
        <Select value={searchOrigin} onValueChange={onSearchOriginChange}>
          <SelectTrigger className="h-7 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="position">Depuis ma position</SelectItem>
            <SelectItem value="address">Depuis une adresse</SelectItem>
          </SelectContent>
        </Select>

        {searchOrigin === 'address' && (
          <Select 
            value={selectedOriginAddress?.id || ''} 
            onValueChange={(id) => {
              const addr = userAddresses.find(a => a.id === id);
              onOriginAddressChange(addr);
            }}
          >
            <SelectTrigger className="h-7 w-48 text-xs">
              <SelectValue placeholder="Choisir une adresse" />
            </SelectTrigger>
            <SelectContent>
              {userAddresses.map(addr => (
                <SelectItem key={addr.id} value={addr.id}>
                  {addr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="max-results" className="text-xs">
            Max résultats: {maxResults}
          </Label>
          <Slider
            id="max-results"
            min={1}
            max={5}
            step={1}
            value={[maxResults]}
            onValueChange={(value) => onMaxResultsChange(value[0])}
            className="w-20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {routeCount} itinéraire{routeCount > 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  );
};

export default MultiDirectionalSearch;