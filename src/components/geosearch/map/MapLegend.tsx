
import React from 'react';

interface MapLegendProps {
  hasRouteLayer: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ hasRouteLayer }) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Légende</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Votre position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Résultats trouvés</span>
        </div>
        {hasRouteLayer && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-blue-500"></div>
            <span>Itinéraire</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLegend;
