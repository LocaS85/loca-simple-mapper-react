
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

const MultiMapToggle: React.FC = () => {
  const [isMultiView, setIsMultiView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMultiView = () => {
    setIsMultiView(prev => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-100"
        onClick={toggleMultiView}
      >
        <LayoutGrid className="h-5 w-5 text-gray-700" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-100"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <Minimize className="h-5 w-5 text-gray-700" />
        ) : (
          <Maximize className="h-5 w-5 text-gray-700" />
        )}
      </Button>
      
      {/* Mini map container that would appear in multi-view mode */}
      {isMultiView && (
        <div className={cn(
          "fixed bottom-20 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all",
          isExpanded ? "w-96 h-64" : "w-32 h-32"
        )}>
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">Mini Map</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiMapToggle;
