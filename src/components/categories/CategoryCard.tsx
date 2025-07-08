import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, ChevronRight } from 'lucide-react';
import { UnifiedCategory } from '@/data/unifiedCategories';
import { TransportMode, DistanceUnit } from '@/types/map';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  category: UnifiedCategory;
  userLocation?: [number, number] | null;
  transportMode?: TransportMode;
  maxDistance?: number;
  distanceUnit?: DistanceUnit;
  isLoading?: boolean;
  onCategorySelect?: (category: UnifiedCategory) => void;
  showSubcategories?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  userLocation,
  transportMode = 'walking',
  maxDistance = 5,
  distanceUnit = 'km',
  isLoading = false,
  onCategorySelect,
  showSubcategories = false
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (!userLocation) return;
    
    const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
    const searchParams = new URLSearchParams({
      category: category.name,
      query: subcategory?.name || category.name,
      lat: userLocation[1].toString(),
      lng: userLocation[0].toString(),
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      autoSearch: 'true',
      count: '8'
    });

    navigate(`/geosearch?${searchParams.toString()}`);
  };

  const handleSearchCategory = () => {
    if (!userLocation) return;
    
    const searchParams = new URLSearchParams({
      category: category.name,
      query: category.name,
      lat: userLocation[1].toString(),
      lng: userLocation[0].toString(),
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      autoSearch: 'true',
      count: '10'
    });

    navigate(`/geosearch?${searchParams.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card 
        className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/20 h-full"
        onClick={handleCategoryClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg flex items-center justify-center min-w-[48px]"
              style={{ backgroundColor: category.color + '15' }}
            >
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {category.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {category.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Subcategories Preview */}
          {showSubcategories && category.subcategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Sous-catégories :</h4>
              <div className="grid grid-cols-2 gap-2">
                {category.subcategories.slice(0, 4).map((sub) => (
                  <Button
                    key={sub.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubcategoryClick(sub.id);
                    }}
                    disabled={!userLocation || isLoading}
                  >
                    <span className="mr-1">{sub.icon}</span>
                    <span className="truncate">{sub.name}</span>
                  </Button>
                ))}
              </div>
              {category.subcategories.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{category.subcategories.length - 4} autres
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {userLocation && (
                <Badge variant="outline" className="text-xs">
                  Position détectée
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {category.subcategories.length} sous-catégories
              </Badge>
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSearchCategory();
              }}
              disabled={!userLocation || isLoading}
              className="flex items-center gap-2 h-8 px-3"
              size="sm"
            >
              <Navigation className="h-3 w-3" />
              <span className="text-xs">
                {isLoading ? 'Recherche...' : 'Rechercher'}
              </span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;