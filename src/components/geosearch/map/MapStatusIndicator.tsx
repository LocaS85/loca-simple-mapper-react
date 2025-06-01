
import React from 'react';

interface MapStatusIndicatorProps {
  resultsCount: number;
  isLoading: boolean;
}

const MapStatusIndicator: React.FC<MapStatusIndicatorProps> = ({ 
  resultsCount, 
  isLoading 
}) => {
  if (isLoading || resultsCount === 0) return null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="font-medium">
          {resultsCount} résultat{resultsCount > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default MapStatusIndicator;
