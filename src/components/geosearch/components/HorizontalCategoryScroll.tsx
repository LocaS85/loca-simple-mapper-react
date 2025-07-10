import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { unifiedCategories } from '@/data/unifiedCategories';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HorizontalCategoryScrollProps {
  selectedCategories: string[];
  onCategorySelect: (categoryId: string) => void;
  onCategoryRemove: (categoryId: string) => void;
  onClearAll: () => void;
  showSubcategories?: boolean;
}

const HorizontalCategoryScroll: React.FC<HorizontalCategoryScrollProps> = ({
  selectedCategories,
  onCategorySelect,
  onCategoryRemove,
  onClearAll,
  showSubcategories = true
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryRemove(categoryId);
      if (selectedMainCategory === categoryId) {
        setSelectedMainCategory(null);
      }
    } else {
      onCategorySelect(categoryId);
      setSelectedMainCategory(categoryId);
    }
  };

  // Get subcategories for selected main category
  const getSubcategories = (mainCategoryId: string) => {
    // This would be populated from your subcategories data
    // For now, returning mock data
    const mockSubcategories = [
      { id: 'fast-food', name: 'Fast Food', mainCategory: 'restaurant' },
      { id: 'fine-dining', name: 'Fine Dining', mainCategory: 'restaurant' },
      { id: 'cafes', name: 'Cafés', mainCategory: 'restaurant' },
      { id: 'bars', name: 'Bars', mainCategory: 'restaurant' }
    ];
    
    return mockSubcategories.filter(sub => sub.mainCategory === mainCategoryId);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4">
      {/* Pills sélectionnées */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600 mr-2">Filtres actifs:</span>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map(categoryId => {
              const category = unifiedCategories.find(cat => cat.id === categoryId);
              if (!category) return null;
              
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="pl-3 pr-1 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  <span className="text-sm">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryRemove(categoryId)}
                    className="ml-1 h-5 w-5 p-0 hover:bg-blue-300/50 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="h-7 px-2 text-xs"
            >
              Tout effacer
            </Button>
          </div>
        </div>
      )}

      {/* Menu horizontal principal */}
      <div className="relative">
        <div className="flex items-center">
          {/* Bouton scroll gauche */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 h-10 w-10 rounded-full bg-white shadow-md border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Container scrollable */}
          <div 
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {unifiedCategories.map(category => {
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    flex-shrink-0 h-10 px-4 rounded-full border-2 transition-all duration-200
                    ${isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Bouton scroll droite */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 h-10 w-10 rounded-full bg-white shadow-md border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Sous-catégories dynamiques */}
      {showSubcategories && selectedMainCategory && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-2">Sous-catégories:</span>
            <div className="flex gap-1">
              {getSubcategories(selectedMainCategory).map(subcategory => (
                <Button
                  key={subcategory.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onCategorySelect(subcategory.id)}
                  className="h-7 px-3 text-xs rounded-full border-gray-200 hover:bg-gray-50"
                >
                  {subcategory.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalCategoryScroll;