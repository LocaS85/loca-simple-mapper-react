
import React, { useEffect } from "react";
import { 
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  MapRef
} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getMapboxToken } from "@/utils/mapboxConfig";

interface MapControlsProps {
  mapRef: React.RefObject<MapRef>;
  initialViewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

const MapControls: React.FC<MapControlsProps> = ({ mapRef, initialViewState }) => {
  // Initialize Mapbox Directions and Geocoder
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    // Add directions control with proper typing
    const directionsControl = new MapboxDirections({
      accessToken: getMapboxToken(),
      unit: 'metric',
      profile: 'mapbox/driving',
      alternatives: true,
      congestion: true,
      language: 'fr-FR',
      controls: {
        inputs: true,
        instructions: false,
        profileSwitcher: true
      }
    });

    // Use type assertion to handle type incompatibility
    map.addControl(directionsControl as unknown as mapboxgl.IControl, 'top-left');

    // Add geocoder control for searching addresses with proper typing
    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      mapboxgl: mapboxgl as typeof import("mapbox-gl"),
      placeholder: 'Rechercher une adresse...',
      language: 'fr-FR',
      countries: 'fr',
      proximity: {
        longitude: initialViewState.longitude,
        latitude: initialViewState.latitude
      }
    });
    map.addControl(geocoder as unknown as mapboxgl.IControl);

    return () => {
      if (map.hasControl(directionsControl as unknown as mapboxgl.IControl)) {
        map.removeControl(directionsControl as unknown as mapboxgl.IControl);
      }
      if (map.hasControl(geocoder as unknown as mapboxgl.IControl)) {
        map.removeControl(geocoder as unknown as mapboxgl.IControl);
      }
    };
  }, [mapRef, initialViewState]);

  // Add map control components
  return (
    <>
      <NavigationControl position="top-right" />
      <GeolocateControl 
        position="top-right" 
        trackUserLocation 
        showUserHeading
      />
      <FullscreenControl position="top-right" />
      <ScaleControl position="bottom-right" />
    </>
  );
};

export default MapControls;
