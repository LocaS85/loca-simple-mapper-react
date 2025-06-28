
import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/categories';

interface CategoryPageHeaderProps {
  category: Category;
  onBack: () => void;
  userLocation?: [number, number] | null;
  subcategoryCount?: number;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  category,
  onBack,
  userLocation,
  subcategoryCount = 0
}) => {
  return (
    <div className="space-y-4">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux catégories
      </Button>

      {/* En-tête de la catégorie */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {category.name}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base leading-relaxed">
                {category.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {userLocation && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Position détectée</span>
              </div>
            )}
            {subcategoryCount > 0 && (
              <Badge variant="secondary">
                {subcategoryCount} sous-catégories
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryPageHeader;
