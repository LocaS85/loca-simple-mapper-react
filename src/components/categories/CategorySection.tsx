
import React from 'react';
import { MapPin, Navigation, Clock, Ruler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/categories';
import { TransportMode, DistanceUnit } from '@/types/map';

interface CategorySectionProps {
  category: Category;
  userLocation?: [number, number] | null;
  onCategorySelect?: (category: Category) => void;
  transportMode?: TransportMode;
  maxDistance?: number;
  maxDuration?: number;
  distanceUnit?: DistanceUnit;
  isLoading?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  userLocation,
  onCategorySelect,
  transportMode = 'walking',
  maxDistance = 5,
  maxDuration = 30,
  distanceUnit = 'km',
  isLoading = false
}) => {
  
  const handleCategoryClick = () => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleStartSearch = () => {
    if (!userLocation) {
      return;
    }
    
    const searchParams = new URLSearchParams({
      category: category.name,
      lat: userLocation[1].toString(),
      lng: userLocation[0].toString(),
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit
    });

    window.location.href = `/geosearch?${searchParams.toString()}`;
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/20 h-full"
      onClick={handleCategoryClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/5 rounded-lg">
            <span className="text-2xl">{category.icon}</span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              {category.name}
            </CardTitle>
            <CardDescription className="text-gray-600 leading-relaxed">
              {category.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {userLocation && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Position détectée</span>
              </div>
            )}
            {category.subcategories && (
              <Badge variant="secondary">
                {category.subcategories.length} sous-catégories
              </Badge>
            )}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStartSearch();
            }}
            disabled={!userLocation || isLoading}
            className="flex items-center gap-2"
            size="sm"
          >
            <Navigation className="h-4 w-4" />
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySection;
