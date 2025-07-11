import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeoSearchFilters } from '@/types/geosearch';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryChip {
  id: string;
  name: string;
  icon: string;
  color: string;
  count?: number;
}

interface HorizontalCategoryBarProps {
  filters: GeoSearchFilters;
  onCategorySelect: (categoryId: string) => void;
  onCategoryRemove: (categoryId: string) => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

// Catégories populaires Google Maps style
const POPULAR_CATEGORIES: CategoryChip[] = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: '#e67e22' },
  { id: 'cafe', name: 'Cafés', icon: '☕', color: '#8e44ad' },
  { id: 'pharmacie', name: 'Pharmacies', icon: '💊', color: '#27ae60' },
  { id: 'supermarche', name: 'Supermarchés', icon: '🛒', color: '#3498db' },
  { id: 'essence', name: 'Essence', icon: '⛽', color: '#e74c3c' },
  { id: 'atm', name: 'ATM', icon: '💳', color: '#34495e' },
  { id: 'parking', name: 'Parking', icon: '🅿️', color: '#7f8c8d' },
  { id: 'hopital', name: 'Hôpitaux', icon: '🏥', color: '#e74c3c' },
  { id: 'ecole', name: 'Écoles', icon: '🏫', color: '#f39c12' },
  { id: 'hotel', name: 'Hôtels', icon: '🏨', color: '#9b59b6' },
  { id: 'transport', name: 'Transport', icon: '🚌', color: '#16a085' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#e67e22' }
];

const HorizontalCategoryBar: React.FC<HorizontalCategoryBarProps> = ({
  filters,
  onCategorySelect,
  onCategoryRemove,
  onClearAll,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Gérer les catégories sélectionnées
  useEffect(() => {
    if (filters.category) {
      const categories = Array.isArray(filters.category) 
        ? filters.category 
        : filters.category.split(',').filter(Boolean);
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  }, [filters.category]);

  // Gérer le scroll et les flèches
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = isMobile ? 200 : 300;
    const currentScroll = scrollRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryRemove(categoryId);
    } else {
      onCategorySelect(categoryId);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    onClearAll();
  };

  return (
    <div className="relative bg-white border-b border-gray-100">
      {/* Container principal avec scroll horizontal */}
      <div className="relative flex items-center">
        {/* Flèche gauche */}
        <AnimatePresence>
          {showLeftArrow && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-0 z-10 bg-gradient-to-r from-white via-white to-transparent pl-2 pr-4"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo('left')}
                className="h-8 w-8 p-0 rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone de scroll */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 px-4 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: showLeftArrow && !isMobile ? '3rem' : '1rem',
            paddingRight: showRightArrow && !isMobile ? '3rem' : '1rem'
          }}
        >
          {/* Bouton Clear All (si des filtres actifs) */}
          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="shrink-0"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pills catégories */}
          {POPULAR_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.div
                key={category.id}
                className="shrink-0"
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={isLoading}
                  className={`
                    h-8 px-3 text-xs font-medium rounded-full transition-all duration-200 
                    border whitespace-nowrap flex items-center gap-1.5
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }
                  `}
                  style={isSelected ? { 
                    backgroundColor: category.color,
                    borderColor: category.color 
                  } : {}}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{category.name}</span>
                  {category.count && (
                    <Badge 
                      variant="secondary" 
                      className="h-4 px-1 text-xs ml-1 bg-white/20 text-inherit border-0"
                    >
                      {category.count}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Flèche droite */}
        <AnimatePresence>
          {showRightArrow && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-0 z-10 bg-gradient-to-l from-white via-white to-transparent pr-2 pl-4"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo('right')}
                className="h-8 w-8 p-0 rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicateurs de filtres actifs (mobile) */}
      {isMobile && selectedCategories.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((catId) => {
              const category = POPULAR_CATEGORIES.find(c => c.id === catId);
              if (!category) return null;
              
              return (
                <Badge
                  key={catId}
                  variant="secondary"
                  className="text-xs h-5 px-2 bg-gray-100 text-gray-700"
                >
                  {category.icon} {category.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalCategoryBar;