
import React from 'react';

interface MapToggleProps {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

const MapToggle: React.FC<MapToggleProps> = ({ showMap, setShowMap }) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg shadow-sm" role="group" aria-label="Vue de l'affichage">
      <button
        onClick={() => setShowMap(false)}
        className={`py-2 px-4 rounded-md transition-all ${
          !showMap 
            ? 'bg-white shadow text-blue-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-pressed={!showMap}
        type="button"
      >
        Liste
      </button>
      <button
        onClick={() => setShowMap(true)}
        className={`py-2 px-4 rounded-md transition-all ${
          showMap 
            ? 'bg-white shadow text-blue-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-pressed={showMap}
        type="button"
      >
        Carte
      </button>
    </div>
  );
};

export default MapToggle;
