
import React, { useRef, useState, useCallback } from "react";
import Map, {
  Marker,
  MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { BBox } from "geojson";
import { getMapboxToken } from "@/utils/mapboxConfig";
import { POI } from "@/types/map";
import MapControls from "./map/MapControls";
import MapCluster from "./map/MapCluster";

type YourMapComponentProps = {
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  pois?: POI[];
};

const YourMapComponent: React.FC<YourMapComponentProps> = ({
  initialViewState = {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 11,
  },
  pois = [],
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialViewState);
  const [viewState, setViewState] = useState({
    ...initialViewState,
    width: "100%",
    height: "100%",
    bearing: 0,
    pitch: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  // Add some sample POIs if none are provided
  const [pointsOfInterest] = useState<POI[]>(
    pois.length > 0 ? pois : [
      { id: "1", name: "Tour Eiffel", category: "Monument", coordinates: [2.2945, 48.8584] },
      { id: "2", name: "Musée du Louvre", category: "Musée", coordinates: [2.3376, 48.8606] },
      { id: "3", name: "Notre-Dame", category: "Monument", coordinates: [2.3499, 48.8529] },
      { id: "4", name: "Centre Pompidou", category: "Musée", coordinates: [2.3522, 48.8606] },
      { id: "5", name: "Sacré-Cœur", category: "Monument", coordinates: [2.3431, 48.8867] },
      { id: "6", name: "Arc de Triomphe", category: "Monument", coordinates: [2.295, 48.8738] },
      { id: "7", name: "Montparnasse", category: "Quartier", coordinates: [2.3265, 48.8425] },
      { id: "8", name: "Jardin du Luxembourg", category: "Parc", coordinates: [2.3371, 48.8462] },
      { id: "9", name: "Opéra Garnier", category: "Monument", coordinates: [2.3316, 48.8719] },
      { id: "10", name: "La Défense", category: "Quartier", coordinates: [2.2376, 48.8908] },
    ]
  );

  // Get map bounds
  const getBounds = (): BBox => {
    if (!mapRef.current) return [-180, -85, 180, 85];
    
    const bounds = mapRef.current.getMap().getBounds().toArray();
    return [
      bounds[0][0], // westLng - min Lng
      bounds[0][1], // southLat - min Lat
      bounds[1][0], // eastLng - max Lng
      bounds[1][1], // northLat - max Lat
    ];
  };

  const handleMapClick = useCallback((event: any) => {
    // Close popup if it's open
    if (showPopup) {
      setShowPopup(false);
      return;
    }
    
    const [lng, lat] = event.lngLat.toArray();
    setSelectedLocation({ ...selectedLocation, latitude: lat, longitude: lng });
  }, [selectedLocation, showPopup]);

  const handleMarkerClick = (poi: POI) => {
    setSelectedPOI(poi);
    setShowPopup(true);
  };

  const handleDirectionsClick = (coordinates: [number, number]) => {
    if (!mapRef.current) return;
    
    // Get the directions control and set the destination
    const directionsControl = mapRef.current.getMap()._controls.find(
      (control: any) => control instanceof MapboxDirections
    );
    
    if (directionsControl) {
      directionsControl.setOrigin([selectedLocation.longitude, selectedLocation.latitude]);
      directionsControl.setDestination(coordinates);
    }
  };

  const handleClusterClick = (longitude: number, latitude: number, expansionZoom: number) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 800
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] rounded-2xl overflow-hidden shadow-xl">
      <Map
        ref={mapRef}
        mapboxAccessToken={getMapboxToken()}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={initialViewState}
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => setViewState({
          ...viewState,
          latitude: evt.viewState.latitude,
          longitude: evt.viewState.longitude,
          zoom: evt.viewState.zoom
        })}
      >
        {/* UI controls */}
        <MapControls 
          mapRef={mapRef} 
          initialViewState={initialViewState}
        />

        {/* Marker clusters */}
        <MapCluster
          pointsOfInterest={pointsOfInterest}
          bounds={getBounds()}
          zoom={viewState.zoom}
          showPopup={showPopup}
          selectedPOI={selectedPOI}
          onMarkerClick={handleMarkerClick}
          onDirectionsClick={handleDirectionsClick}
          onClusterClick={handleClusterClick}
          onPopupClose={() => setShowPopup(false)}
        />

        {/* Marker for clicked location */}
        <Marker
          longitude={selectedLocation.longitude}
          latitude={selectedLocation.latitude}
          color="#3b82f6"
          draggable
          onDragEnd={(e) => {
            setSelectedLocation({
              ...selectedLocation,
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
            });
          }}
        />
      </Map>
    </div>
  );
};

export default YourMapComponent;
