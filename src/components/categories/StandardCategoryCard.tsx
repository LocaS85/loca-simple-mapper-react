import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Category, Subcategory } from '@/hooks/useSupabaseCategories';

interface StandardCategoryCardProps {
  category: Category;
  subcategories: Subcategory[];
  transportMode?: string;
  maxDistance?: number;
  distanceUnit?: string;
  aroundMeCount?: number;
}

const StandardCategoryCard: React.FC<StandardCategoryCardProps> = ({
  category,
  subcategories,
  transportMode = 'walking',
  maxDistance = 5,
  distanceUnit = 'km',
  aroundMeCount = 3
}) => {
  const navigate = useNavigate();

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    const searchParams = new URLSearchParams({
      category: category.id,
      subcategory: subcategory.id,
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      aroundMeCount: aroundMeCount.toString(),
      query: subcategory.search_terms[0] || subcategory.name
    });

    navigate(`/geosearch?${searchParams.toString()}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <span>{category.name}</span>
        </CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant="outline"
              className="flex items-center gap-2 p-3 h-auto justify-start text-left"
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              <span className="text-lg">{subcategory.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{subcategory.name}</div>
                {subcategory.description && (
                  <div className="text-xs text-gray-500 mt-1">{subcategory.description}</div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {subcategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune sous-catégorie disponible</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                const searchParams = new URLSearchParams({
                  category: category.id,
                  transport: transportMode,
                  distance: maxDistance.toString(),
                  unit: distanceUnit,
                  aroundMeCount: aroundMeCount.toString(),
                  query: category.name
                });
                navigate(`/geosearch?${searchParams.toString()}`);
              }}
            >
              Rechercher dans {category.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandardCategoryCard;