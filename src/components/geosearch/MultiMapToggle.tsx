
import React from 'react';
import { Button } from '@/components/ui/button';
import { Route, Eye, EyeOff } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { TransportMode } from '@/lib/data/transportModes';

interface MultiMapToggleProps {
  className?: string;
}

const MultiMapToggle: React.FC<MultiMapToggleProps> = ({ className = "" }) => {
  const { filters, updateFilters } = useGeoSearchStore();
  const isMultiRouteEnabled = filters.showMultiDirections;

  const toggleMultiRoute = () => {
    updateFilters({
      showMultiDirections: !isMultiRouteEnabled
    });
    console.log('🗺️ Multi-tracés', !isMultiRouteEnabled ? 'activés' : 'désactivés');
  };

  const getTransportColor = (transport: TransportMode): string => {
    const colors = {
      walking: '#10b981', // vert
      cycling: '#3b82f6', // bleu
      car: '#ef4444',     // rouge
      bus: '#f59e0b',     // orange
      train: '#8b5cf6'    // violet
    };
    return colors[transport] || colors.walking;
  };

  const getTransportLabel = (transport: TransportMode): string => {
    const labels = {
      walking: '🚶 Marche',
      cycling: '🚴 Vélo', 
      car: '🚗 Voiture',
      bus: '🚌 Bus',
      train: '🚆 Train'
    };
    return labels[transport] || 'Transport';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        variant={isMultiRouteEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleMultiRoute}
        className="flex items-center gap-1 bg-white shadow-md hover:shadow-lg transition-all"
        title={isMultiRouteEnabled ? "Masquer les tracés" : "Afficher les tracés"}
      >
        {isMultiRouteEnabled ? (
          <>
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Masquer</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Tracés</span>
          </>
        )}
      </Button>

      {/* Légende des couleurs si multi-tracé activé */}
      {isMultiRouteEnabled && (
        <div className="bg-white rounded-lg shadow-md p-3 text-xs border border-gray-200">
          <div className="font-medium mb-2 text-gray-700">Légende transport:</div>
          <div className="space-y-1">
            {(['walking', 'cycling', 'car'] as TransportMode[]).map((transport) => (
              <div key={transport} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: getTransportColor(transport) }}
                />
                <span className="text-gray-600">{getTransportLabel(transport)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiMapToggle;
