
import React from 'react';
import { TransportMode, transportModes } from '@/lib/data/transportModes';

interface TransportLegendProps {
  activeRoutes: TransportMode[];
  className?: string;
}

// Synchroniser avec TRANSPORT_COLORS de GoogleMapsMap
const transportColors = {
  car: '#3B82F6',
  walking: '#10B981',
  cycling: '#F59E0B',
  bus: '#8B5CF6',
  train: '#EF4444'
};

const TransportLegend: React.FC<TransportLegendProps> = ({
  activeRoutes,
  className = ""
}) => {
  if (activeRoutes.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Légende des itinéraires</h3>
      <div className="space-y-2">
        {activeRoutes.map(mode => {
          const transport = transportModes.find(t => t.value === mode);
          const color = transportColors[mode];
          
          return (
            <div key={mode} className="flex items-center gap-2">
              <div 
                className="w-4 h-1 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600">
                {transport?.label || mode}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransportLegend;
