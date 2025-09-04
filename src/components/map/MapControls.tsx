
import React, { useEffect } from "react";
import { 
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  MapRef
} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getMapboxTokenSync } from "@/utils/mapboxConfig";

interface MapControlsProps {
  mapRef: React.RefObject<MapRef>;
  initialViewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

const MapControls: React.FC<MapControlsProps> = ({ mapRef, initialViewState }) => {
  // Initialize Mapbox Geocoder only (Directions handled by separate component)
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    // Add geocoder control for searching addresses with proper typing
    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxTokenSync(),
      mapboxgl: mapboxgl,
      placeholder: 'Rechercher une adresse...',
      language: 'fr-FR',
      countries: 'fr',
      proximity: {
        longitude: initialViewState.longitude,
        latitude: initialViewState.latitude
      }
    });
    map.addControl(geocoder as unknown as mapboxgl.IControl, 'top-left');

    return () => {
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
