import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Subcategory } from '@/hooks/useSupabaseCategories';
import { getCategoryIcon, getSubcategoryIcon } from '@/utils/categoryIcons';
import { useCategorySync } from '@/hooks/useCategorySync';

interface ModernCategoryCardProps {
  category: Category;
  subcategories: Subcategory[];
  transportMode?: string;
  maxDistance?: number;
  distanceUnit?: string;
  aroundMeCount?: number;
  onDetailClick?: () => void;
}

const ModernCategoryCard: React.FC<ModernCategoryCardProps> = ({
  category,
  subcategories,
  transportMode = 'walking',
  maxDistance = 5,
  distanceUnit = 'km',
  aroundMeCount = 3,
  onDetailClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Utiliser le hook de synchronisation pour navigation seamless
  const { navigateToGeoSearch, currentLocation } = useCategorySync();

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    console.log('🎯 Clic sur sous-catégorie:', subcategory.name);
    
    navigateToGeoSearch({
      category: category.id,
      subcategory: subcategory.id,
      query: subcategory.search_terms?.[0] || subcategory.name,
      transport: transportMode,
      distance: maxDistance,
      autoSearch: true,
      coordinates: currentLocation || undefined
    });
  };

  const handleCategoryClick = () => {
    console.log('🏷️ Clic sur catégorie:', category.name);
    
    navigateToGeoSearch({
      category: category.id,
      query: category.name,
      transport: transportMode as any,
      distance: maxDistance,
      autoSearch: true,
      coordinates: currentLocation || undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full w-full"
    >
      <Card 
        className="w-full h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/50 cursor-pointer relative group bg-gradient-to-br from-white to-gray-50/30"
        style={{ borderColor: isHovered ? category.color : undefined }}
      >
        <CardHeader 
          className="pb-3 transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: isHovered ? `${category.color}08` : undefined }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          <CardTitle className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg relative overflow-hidden flex-shrink-0"
                style={{ 
                  backgroundColor: category.color,
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`
                }}
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 text-white filter drop-shadow-sm">
                  {getCategoryIcon(category.name, category.icon)}
                </div>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-foreground truncate">{category.name}</h3>
                {subcategories.length > 0 && (
                  <span className="text-sm text-muted-foreground">{subcategories.length} sous-catégories</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
              >
                <Search className="h-3 w-3" />
              </Button>
              {onDetailClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetailClick();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
                  title="Voir les détails"
                >
                  ⋯
                </Button>
              )}
              {subcategories.length > 0 && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              )}
            </div>
          </CardTitle>
          {category.description && (
            <CardDescription className="text-sm text-muted-foreground mt-2">
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
                <div className="relative">
                  {/* Navigation arrows for subcategories */}
                  {subcategories.length > 3 && (
                    <>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                        <button
                          className="w-6 h-6 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-primary"
                          onClick={() => {
                            const container = document.getElementById(`subcategories-scroll-${category.id}`);
                            if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                          }}
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                        <button
                          className="w-6 h-6 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-primary"
                          onClick={() => {
                            const container = document.getElementById(`subcategories-scroll-${category.id}`);
                            if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                          }}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                  
                  {/* Horizontal scrolling subcategories */}
                  <div 
                    id={`subcategories-scroll-${category.id}`}
                    className="flex overflow-x-auto gap-2 pb-2 scroll-smooth px-1 scrollbar-hide scroll-touch"
                  >
                    {subcategories.map((subcategory, index) => (
                      <motion.div
                        key={subcategory.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 px-3 py-2 h-auto text-left hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200 rounded-lg group/sub relative overflow-hidden whitespace-nowrap min-w-max"
                          onClick={() => handleSubcategoryClick(subcategory)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/sub:translate-x-[100%] transition-transform duration-700" />
                          <motion.div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                            style={{ backgroundColor: `${category.color}15` }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="relative z-10 text-xs">
                              {getSubcategoryIcon(subcategory.name, category.name, subcategory.icon)}
                            </div>
                            <div 
                              className="absolute inset-0 rounded-lg opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200"
                              style={{ backgroundColor: `${category.color}25` }}
                            />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">
                              {subcategory.name}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
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