import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedSubcategory } from '@/data/unifiedCategories';
import { Search, ChevronRight } from 'lucide-react';

interface SubcategoryGridProps {
  subcategories: UnifiedSubcategory[];
  parentCategoryColor: string;
  onSubcategorySelect: (subcategoryId: string) => void;
  isLoading?: boolean;
}

const SubcategoryGrid: React.FC<SubcategoryGridProps> = ({
  subcategories,
  parentCategoryColor,
  onSubcategorySelect,
  isLoading = false
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subcategories.map((subcategory, index) => (
        <motion.div
          key={subcategory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card 
            className="cursor-pointer transition-all hover:shadow-md hover:scale-105 h-full"
            onClick={() => onSubcategorySelect(subcategory.id)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
              <div 
                className="p-3 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: parentCategoryColor + '15' }}
              >
                <span className="text-2xl">{subcategory.icon}</span>
              </div>
              
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-sm leading-tight">
                  {subcategory.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {subcategory.description}
                </p>
              </div>

              {subcategory.searchTerms && subcategory.searchTerms.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {subcategory.searchTerms.slice(0, 2).map((term, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs px-1 py-0"
                    >
                      {term}
                    </Badge>
                  ))}
                  {subcategory.searchTerms.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{subcategory.searchTerms.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSubcategorySelect(subcategory.id);
                }}
                disabled={isLoading}
                size="sm"
                className="w-full h-8 text-xs"
                style={{ backgroundColor: parentCategoryColor }}
              >
                <Search className="h-3 w-3 mr-1" />
                {isLoading ? 'Recherche...' : 'Rechercher'}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SubcategoryGrid;