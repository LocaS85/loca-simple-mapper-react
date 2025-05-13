
import React from "react";
import { Marker, Popup } from "react-map-gl";
import { POI } from "@/types/map";

interface POIMarkerProps {
  poi: POI;
  showPopup: boolean;
  selectedPOI: POI | null;
  onMarkerClick: (poi: POI) => void;
  onDirectionsClick: (coordinates: [number, number]) => void;
  onClose: () => void;
}

const POIMarker: React.FC<POIMarkerProps> = ({
  poi,
  showPopup,
  selectedPOI,
  onMarkerClick,
  onDirectionsClick,
  onClose,
}) => {
  const isSelected = selectedPOI?.id === poi.id;
  
  return (
    <>
      <Marker
        key={poi.id}
        longitude={poi.coordinates[0]}
        latitude={poi.coordinates[1]}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          onMarkerClick(poi);
        }}
      >
        <div className="marker-poi">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center
            ${poi.category === 'Monument' ? 'bg-red-500' : 
              poi.category === 'Musée' ? 'bg-purple-500' :
              poi.category === 'Parc' ? 'bg-green-500' :
              'bg-blue-500'}`}>
            <span className="text-white text-xs font-bold">
              {poi.category === 'Monument' ? '🏛️' : 
               poi.category === 'Musée' ? '🖼️' :
               poi.category === 'Parc' ? '🌳' :
               '📍'}
            </span>
          </div>
        </div>
      </Marker>
      
      {showPopup && isSelected && (
        <Popup
          longitude={poi.coordinates[0]}
          latitude={poi.coordinates[1]}
          anchor="bottom"
          onClose={onClose}
          closeButton={true}
          className="z-10"
        >
          <div className="p-2">
            <h3 className="font-bold text-sm">{poi.name}</h3>
            <p className="text-xs text-gray-600">{poi.category}</p>
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => onDirectionsClick(poi.coordinates)}
            >
              Obtenir l'itinéraire
            </button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default POIMarker;
