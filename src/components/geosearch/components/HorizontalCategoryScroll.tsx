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
    <div className="bg-background border-b border-border py-2 px-3 overflow-hidden">
      {/* Menu horizontal simplifié */}
      <div className="relative">
        <div className="flex items-center">
          {/* Bouton scroll gauche */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 h-8 w-8 rounded-full bg-background shadow-md border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Container scrollable épuré */}
          <div 
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {unifiedCategories.slice(0, 8).map(category => {
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex-shrink-0 h-8 px-3 rounded-full transition-all duration-200"
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
              className="absolute right-0 z-10 h-8 w-8 rounded-full bg-background shadow-md border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCategoryScroll;