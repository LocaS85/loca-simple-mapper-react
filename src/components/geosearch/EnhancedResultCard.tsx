
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, Star, ExternalLink, Heart } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { useFavorites } from '@/contexts/FavoritesContext';

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
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === result.id);

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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({
      id: result.id,
      name: result.name,
      address: result.address || '',
      coordinates: result.coordinates,
      category: result.category
    });
  };

  // URLs de navigation externe
  const [lat, lng] = result.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`} onClick={handleSelect}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {result.name}
          </CardTitle>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {result.category && (
              <Badge variant="secondary">
                {result.category}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="p-1 h-8 w-8"
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
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
        </div>

        {/* Navigation externe */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-1 text-xs"
          >
            <ExternalLink className="h-3 w-3" />
            Google Maps
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              window.open(wazeUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-1 text-xs"
          >
            <Navigation className="h-3 w-3" />
            Waze
          </Button>

          {onNavigate && (
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="shrink-0 ml-auto"
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
