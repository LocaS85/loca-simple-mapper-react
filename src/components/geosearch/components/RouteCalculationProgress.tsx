import React from 'react';
import { Loader2 } from 'lucide-react';

interface RouteCalculationProgressProps {
  isCalculating: boolean;
  currentRoute: number;
  totalRoutes: number;
  className?: string;
}

const RouteCalculationProgress: React.FC<RouteCalculationProgressProps> = ({
  isCalculating,
  currentRoute,
  totalRoutes,
  className = ""
}) => {
  if (!isCalculating) return null;

  return (
    <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-3 border">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <div className="text-sm">
          <span className="font-medium text-gray-700">
            Calcul des itinéraires...
          </span>
          <span className="text-gray-500 ml-2">
            ({currentRoute}/{totalRoutes})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteCalculationProgress;