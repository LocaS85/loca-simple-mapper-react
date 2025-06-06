
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, Star } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface EnhancedResultCardProps {
  result: SearchResult;
  onNavigate?: (coordinates: [number, number]) => void;
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

const EnhancedResultCard: React.FC<EnhancedResultCardProps> = ({
  result,
  onNavigate,
  onSelect,
  className = ''
}) => {
  const handleNavigate = () => {
    if (onNavigate && result.coordinates) {
      onNavigate(result.coordinates);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(result);
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`} onClick={handleSelect}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {result.name}
          </CardTitle>
          {result.category && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {result.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {result.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{result.address}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {result.distance && (
              <div className="flex items-center gap-1">
                <Navigation className="h-4 w-4" />
                <span>{result.distance} km</span>
              </div>
            )}
            {result.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{result.duration} min</span>
              </div>
            )}
          </div>
          
          {onNavigate && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="shrink-0"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Itinéraire
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedResultCard;
