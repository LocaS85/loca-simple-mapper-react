
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/categories';

interface SubcategoriesListProps {
  category: Category;
  selectedSubcategory?: string;
  onSubcategorySelect?: (subcategory: string) => void;
  parentCategory: string;
}

const SubcategoriesList: React.FC<SubcategoriesListProps> = ({
  category,
  selectedSubcategory,
  onSubcategorySelect,
  parentCategory
}) => {
  if (!category.subcategories || category.subcategories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {category.subcategories.map((subcategory) => (
        <Card 
          key={subcategory}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedSubcategory === subcategory ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSubcategorySelect?.(subcategory)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {subcategory}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant="outline" className="text-xs">
              {parentCategory}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubcategoriesList;
