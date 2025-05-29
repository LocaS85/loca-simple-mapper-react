
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getMapboxToken } from "@/utils/mapboxConfig";
import { useIsMobile } from "@/hooks/use-mobile";

type MapboxSearchBarProps = {
  mapRef: React.RefObject<mapboxgl.Map>;
  onResult?: (location: {
    lng: number;
    lat: number;
    place_name: string;
  }) => void;
  placeholder?: string;
};

const MapboxSearchBar: React.FC<MapboxSearchBarProps> = ({ 
  mapRef, 
  onResult,
  placeholder = "Rechercher un lieu..."
}) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!mapRef.current || !geocoderContainerRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      mapboxgl: mapboxgl,
      placeholder,
      marker: false,
      language: "fr",
      countries: "fr",
    });

    geocoderContainerRef.current.innerHTML = "";
    geocoder.addTo(geocoderContainerRef.current);

    geocoder.on("result", (e) => {
      const { center, place_name } = e.result;
      const [lng, lat] = center;
      
      onResult?.({ lng, lat, place_name });
      
      mapRef.current?.flyTo({ 
        center: [lng, lat], 
        zoom: isMobile ? 14 : 16,
        duration: 1000
      });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(place_name);

      markerRef.current = new mapboxgl.Marker({ color: "#3B82F6" })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markerRef.current.togglePopup();
    });

    geocoder.on('error', () => {
      console.error('Geocoder error occurred');
    });

    return () => {
      geocoder.clear();
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [mapRef, onResult, isMobile, placeholder]);

  return (
    <div
      ref={geocoderContainerRef}
      className="w-full sm:w-96 z-50 bg-white rounded-xl shadow-md p-1"
    />
  );
};

export default MapboxSearchBar;
