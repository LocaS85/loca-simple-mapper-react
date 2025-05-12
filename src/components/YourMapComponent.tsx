
import React, { useRef, useState, useCallback } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  Marker,
  MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { getMapboxToken } from "@/utils/mapboxConfig";

type YourMapComponentProps = {
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

const YourMapComponent: React.FC<YourMapComponentProps> = ({
  initialViewState = {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 11,
  },
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialViewState);

  const handleMapClick = useCallback((event: any) => {
    const [lng, lat] = event.lngLat;
    setSelectedLocation({ ...selectedLocation, latitude: lat, longitude: lng });
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] rounded-2xl overflow-hidden shadow-xl">
      <Map
        ref={mapRef}
        mapboxAccessToken={getMapboxToken()}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={initialViewState}
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
      >
        {/* UI controls */}
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <ScaleControl position="bottom-right" />

        {/* Marker for clicked location */}
        <Marker
          longitude={selectedLocation.longitude}
          latitude={selectedLocation.latitude}
          color="#3b82f6"
        />
      </Map>
    </div>
  );
};

export default YourMapComponent;
