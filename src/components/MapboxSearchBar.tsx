
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getMapboxTokenSync, isMapboxTokenValid } from "@/utils/mapboxConfig";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGeoSearchStore } from "@/store/geoSearchStore";

interface MapboxSearchBarProps {
  mapRef: React.RefObject<mapboxgl.Map>;
  onResult?: (location: {
    lng: number;
    lat: number;
    place_name: string;
  }) => void;
  placeholder?: string;
  className?: string;
}

const MapboxSearchBar: React.FC<MapboxSearchBarProps> = ({ 
  mapRef, 
  onResult,
  placeholder = "Rechercher un lieu...",
  className = ""
}) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const isMobile = useIsMobile();
  const { userLocation } = useGeoSearchStore();

  useEffect(() => {
    if (!mapRef.current || !geocoderContainerRef.current || !isMapboxTokenValid()) return;

    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxTokenSync(),
      mapboxgl: mapboxgl,
      placeholder,
      marker: false,
      language: "fr",
      countries: "fr",
      proximity: userLocation ? {
        longitude: userLocation[0],
        latitude: userLocation[1]
      } : {
        longitude: 2.3522,
        latitude: 48.8566
      },
      bbox: [-5.0, 41.0, 9.0, 51.0], // France bounds
    });

    geocoderContainerRef.current.innerHTML = "";
    geocoder.addTo(geocoderContainerRef.current);

    // Improve geocoder styling
    const geocoderInput = geocoderContainerRef.current.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLInputElement;
    if (geocoderInput) {
      geocoderInput.style.height = isMobile ? '44px' : '48px';
      geocoderInput.style.fontSize = '16px';
      geocoderInput.style.borderRadius = '12px';
      geocoderInput.style.border = '2px solid #e5e7eb';
      geocoderInput.style.transition = 'all 0.2s ease';
      geocoderInput.style.backgroundColor = 'white';
    }

    geocoder.on("result", (e) => {
      const { center, place_name } = e.result;
      const [lng, lat] = center;
      
      onResult?.({ lng, lat, place_name });
      
      mapRef.current?.flyTo({ 
        center: [lng, lat], 
        zoom: isMobile ? 15 : 16,
        duration: 1200,
        essential: true
      });

      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker with popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-medium text-sm mb-2">${place_name}</h3>
          <p class="text-xs text-gray-500">Cliquez sur la carte pour plus d'options</p>
        </div>
      `);

      markerRef.current = new mapboxgl.Marker({ 
        color: "#3B82F6",
        scale: 1.2
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      // Show popup after delay
      setTimeout(() => {
        markerRef.current?.togglePopup();
      }, 500);
    });

    geocoder.on('error', (error) => {
      console.error('Geocoder error:', error);
    });

    geocoder.on('clear', () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    });

    return () => {
      geocoder.clear();
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [mapRef, onResult, isMobile, placeholder, userLocation]);

  return (
    <div
      ref={geocoderContainerRef}
      className={`w-full sm:w-96 lg:w-[420px] z-50 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow ${className}`}
      style={{
        maxWidth: isMobile ? '100%' : '420px'
      }}
    />
  );
};

export default MapboxSearchBar;
