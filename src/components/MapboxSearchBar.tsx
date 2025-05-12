
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { getMapboxToken } from "@/utils/mapboxConfig";

type MapboxSearchBarProps = {
  mapRef: React.RefObject<mapboxgl.Map>; // référence vers la carte Mapbox
  onResult?: (location: {
    lng: number;
    lat: number;
    place_name: string;
  }) => void;
};

const MapboxSearchBar: React.FC<MapboxSearchBarProps> = ({ mapRef, onResult }) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !geocoderContainerRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      mapboxgl,
      placeholder: "Rechercher un lieu...",
      marker: false,
    });

    geocoder.addTo(geocoderContainerRef.current);

    geocoder.on("result", (e) => {
      const { center, place_name } = e.result;
      const [lng, lat] = center;
      onResult?.({ lng, lat, place_name });
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });
    });

    return () => geocoder.clear();
  }, [mapRef, onResult]);

  return (
    <div
      ref={geocoderContainerRef}
      className="w-full sm:w-96 z-50 bg-white rounded-xl shadow-md p-1"
    />
  );
};

export default MapboxSearchBar;
