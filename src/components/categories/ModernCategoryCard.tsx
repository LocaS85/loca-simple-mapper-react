import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Category, Subcategory } from '@/hooks/useSupabaseCategories';

interface ModernCategoryCardProps {
  category: Category;
  subcategories: Subcategory[];
  transportMode?: string;
  maxDistance?: number;
  distanceUnit?: string;
  aroundMeCount?: number;
}

const ModernCategoryCard: React.FC<ModernCategoryCardProps> = ({
  category,
  subcategories,
  transportMode = 'walking',
  maxDistance = 5,
  distanceUnit = 'km',
  aroundMeCount = 3
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    const searchParams = new URLSearchParams({
      category: category.id,
      subcategory: subcategory.id,
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      aroundMeCount: aroundMeCount.toString(),
      query: subcategory.search_terms?.[0] || subcategory.name
    });

    navigate(`/geosearch?${searchParams.toString()}`);
  };

  const handleCategoryClick = () => {
    const searchParams = new URLSearchParams({
      category: category.id,
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      aroundMeCount: aroundMeCount.toString(),
      query: category.name
    });
    navigate(`/geosearch?${searchParams.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className="w-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer relative group"
        style={{ borderColor: isHovered ? category.color : undefined }}
      >
        <CardHeader 
          className="pb-3 transition-colors duration-300"
          style={{ backgroundColor: isHovered ? `${category.color}10` : undefined }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: category.color,
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}88)`
                }}
              >
                <span className="text-xl filter drop-shadow-sm">{category.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                {subcategories.length > 0 && (
                  <span className="text-sm text-gray-500">{subcategories.length} sous-catégories</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Search className="h-4 w-4" />
              </Button>
              {subcategories.length > 0 && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              )}
            </div>
          </CardTitle>
          {category.description && (
            <CardDescription className="text-sm text-gray-600">
              {category.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <AnimatePresence>
          {(isExpanded || isHovered) && subcategories.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subcategories.map((subcategory, index) => (
                    <motion.div
                      key={subcategory.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full flex items-center gap-3 p-3 h-auto justify-start text-left hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200 rounded-lg group/sub"
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover/sub:scale-110"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <span className="text-sm">{subcategory.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {subcategory.name}
                          </div>
                          {subcategory.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {subcategory.description}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        {subcategories.length === 0 && (
          <CardContent className="pt-0 pb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCategoryClick}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher dans {category.name}
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default ModernCategoryCard;