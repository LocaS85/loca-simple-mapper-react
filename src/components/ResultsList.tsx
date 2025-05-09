
import React from 'react';
import { Place, TransportMode } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

interface ResultsListProps {
  results: Place[];
  transportMode: TransportMode;
  onSelectResult: (result: Place) => void;
  onClose?: () => void;
}

const getTransportIcon = (mode: TransportMode) => {
  switch (mode) {
    case 'driving': return '🚗';
    case 'walking': return '🚶';
    case 'cycling': return '🚴';
    case 'transit': return '🚌';
    default: return '🚶';
  }
};

const ResultsList: React.FC<ResultsListProps> = ({ 
  results, 
  transportMode, 
  onSelectResult,
  onClose 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      ${isMobile ? 'fixed bottom-0 left-0 right-0 z-20 max-h-[60vh] rounded-t-lg' : 'hidden md:block w-80 border-l'} 
      border-gray-200 bg-white overflow-y-auto shadow-lg
    `}>
      <div className="sticky top-0 p-3 md:p-4 border-b border-gray-200 bg-white z-10 flex justify-between items-center">
        <h2 className="text-base md:text-lg font-semibold">Résultats ({results.length})</h2>
        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close results"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div>
        {results.map((place) => (
          <div
            key={place.id}
            className="p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectResult(place)}
          >
            <h3 className="font-medium text-blue-600">{place.name}</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{place.address}</p>
            {place.distance !== undefined && place.duration !== undefined && (
              <div className="mt-2 flex items-center text-xs md:text-sm text-gray-600">
                <span className="mr-2">{getTransportIcon(transportMode)}</span>
                <span>{place.distance} m • {place.duration} min</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
