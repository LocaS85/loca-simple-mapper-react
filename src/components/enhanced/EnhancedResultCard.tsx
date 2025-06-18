
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface EnhancedResultCardProps {
  result: SearchResult;
  onNavigate?: (result: SearchResult) => void;
  onSelect?: (result: SearchResult) => void;
  isSelected?: boolean;
}

const EnhancedResultCard: React.FC<EnhancedResultCardProps> = ({
  result,
  onNavigate,
  onSelect,
  isSelected = false
}) => {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate flex-1">{result.name}</h3>
          {result.category && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {result.category}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm truncate">{result.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {result.distance && (
              <div className="flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                <span>{result.distance} km</span>
              </div>
            )}
            {result.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{result.duration} min</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {onSelect && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelect(result)}
              >
                Sélectionner
              </Button>
            )}
            {onNavigate && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onNavigate(result)}
              >
                Y aller
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedResultCard;
