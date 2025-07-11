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
  selectedMainCategory?: string | null;
  onMainCategoryChange?: (categoryId: string | null) => void;
}

const HorizontalCategoryScroll: React.FC<HorizontalCategoryScrollProps> = ({
  selectedCategories,
  onCategorySelect,
  onCategoryRemove,
  onClearAll,
  showSubcategories = true,
  selectedMainCategory: propSelectedMainCategory,
  onMainCategoryChange
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(propSelectedMainCategory || null);

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
        const newMainCategory = null;
        setSelectedMainCategory(newMainCategory);
        onMainCategoryChange?.(newMainCategory);
      }
    } else {
      onCategorySelect(categoryId);
      const newMainCategory = categoryId;
      setSelectedMainCategory(newMainCategory);
      onMainCategoryChange?.(newMainCategory);
    }
  };

  // Sync with prop changes
  React.useEffect(() => {
    if (propSelectedMainCategory !== selectedMainCategory) {
      setSelectedMainCategory(propSelectedMainCategory || null);
    }
  }, [propSelectedMainCategory]);

  // Get subcategories for selected main category
  const getSubcategories = (mainCategoryId: string) => {
    const category = unifiedCategories.find(cat => cat.id === mainCategoryId);
    if (category && category.subcategories) {
      return category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        mainCategory: mainCategoryId
      }));
    }
    
    // Fallback to mock data for categories without subcategories
    const mockSubcategories: Record<string, Array<{id: string, name: string, mainCategory: string}>> = {
      restaurant: [
        { id: 'fast-food', name: 'Fast Food', mainCategory: 'restaurant' },
        { id: 'fine-dining', name: 'Fine Dining', mainCategory: 'restaurant' },
        { id: 'cafes', name: 'Cafés', mainCategory: 'restaurant' },
        { id: 'bars', name: 'Bars', mainCategory: 'restaurant' }
      ],
      health: [
        { id: 'pharmacy', name: 'Pharmacie', mainCategory: 'health' },
        { id: 'hospital', name: 'Hôpital', mainCategory: 'health' },
        { id: 'doctor', name: 'Médecin', mainCategory: 'health' }
      ],
      shopping: [
        { id: 'supermarket', name: 'Supermarché', mainCategory: 'shopping' },
        { id: 'clothing', name: 'Vêtements', mainCategory: 'shopping' },
        { id: 'electronics', name: 'Électronique', mainCategory: 'shopping' }
      ]
    };
    
    return mockSubcategories[mainCategoryId] || [];
  };

  return (
    <div className="bg-white border-b border-gray-200 py-1 px-2 md:px-3 overflow-hidden">
      {/* Pills sélectionnées - Optimisées */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-600 mr-1">Actifs:</span>
          <div className="flex flex-wrap gap-0.5">
            {selectedCategories.map(categoryId => {
              const category = unifiedCategories.find(cat => cat.id === categoryId);
              if (!category) return null;
              
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="pl-1.5 pr-0.5 py-0 h-5 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <span className="text-xs">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryRemove(categoryId)}
                    className="ml-1 h-3 w-3 p-0 hover:bg-white/20 rounded-full"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="h-5 px-1.5 text-xs"
            >
              ✕ Tout
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
              className="absolute left-0 z-10 h-6 w-6 rounded-full bg-white shadow-md border"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          )}

          {/* Container scrollable */}
          <div 
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex gap-1 overflow-x-auto scrollbar-hide py-0.5 px-6 md:px-8"
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
                    flex-shrink-0 h-6 px-2 rounded-full border transition-all duration-200
                    ${isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xs font-medium whitespace-nowrap">
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
              className="absolute right-0 z-10 h-6 w-6 rounded-full bg-white shadow-md border"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Sous-catégories dynamiques - Optimisées */}
      {showSubcategories && selectedMainCategory && (
        <div className="mt-1 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Sous:</span>
            <div className="flex gap-0.5">
              {getSubcategories(selectedMainCategory).map(subcategory => (
                <Button
                  key={subcategory.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onCategorySelect(subcategory.id)}
                  className="h-5 px-1.5 text-xs rounded-full border-gray-200 hover:bg-gray-50"
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