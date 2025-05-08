
import React from 'react';
import { Place, TransportMode } from '../types';

interface ResultsListProps {
  results: Place[];
  transportMode: TransportMode;
  onSelectResult: (result: Place) => void;
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

const ResultsList: React.FC<ResultsListProps> = ({ results, transportMode, onSelectResult }) => {
  return (
    <div className="hidden md:block w-80 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Résultats ({results.length})</h2>
      </div>
      <div>
        {results.map((place) => (
          <div
            key={place.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectResult(place)}
          >
            <h3 className="font-medium text-blue-600">{place.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{place.address}</p>
            {place.distance !== undefined && place.duration !== undefined && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
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
