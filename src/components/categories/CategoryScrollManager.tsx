import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryScrollManagerProps {
  containerId: string;
  itemCount: number;
  itemWidth: number;
  onScrollChange?: (scrollIndex: number) => void;
}

const CategoryScrollManager: React.FC<CategoryScrollManagerProps> = ({
  containerId,
  itemCount,
  itemWidth,
  onScrollChange
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (container) {
      scrollContainerRef.current = container as HTMLDivElement;
      
      const handleScroll = () => {
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const totalWidth = container.scrollWidth;
        
        // Update arrow visibility
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + containerWidth < totalWidth - 10);
        
        // Calculate current index for mobile indicators
        const newIndex = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(newIndex);
        onScrollChange?.(newIndex);
        
        // Update mobile indicators
        for (let i = 0; i < itemCount; i++) {
          const indicator = document.getElementById(`indicator-${i}`);
          if (indicator) {
            indicator.className = i === newIndex 
              ? 'w-2 h-2 rounded-full bg-primary transition-colors duration-200'
              : 'w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200';
          }
        }
      };
      
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [containerId, itemCount, itemWidth, onScrollChange]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Navigation Arrows */}
      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button
            className="hidden md:flex w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-primary backdrop-blur-sm"
            onClick={scrollLeft}
            aria-label="Précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button
            className="hidden md:flex w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-primary backdrop-blur-sm"
            onClick={scrollRight}
            aria-label="Suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default CategoryScrollManager;