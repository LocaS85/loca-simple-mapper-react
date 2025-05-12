
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

interface MapboxMapProps {
  results: any[];
  transport: string;
  radius: number;
  count: number;
  category: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ results, transport, radius, category }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.35, 48.85]); // Default to Paris
  const { toast } = useToast();

  // Définir le token Mapbox directement
  const mapboxToken = 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg';

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          title: "Localisation",
          description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
          variant: "destructive",
        });
      }
    );
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation,
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [toast]);

  // Update map when user location changes
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 12,
        essential: true
      });

      // Add user marker
      new mapboxgl.Marker({ color: "#3B82F6" })
        .setLngLat(userLocation)
        .addTo(map.current);
    }
  }, [userLocation]);

  // Update markers when results change
  useEffect(() => {
    if (!map.current || !results.length) return;

    // Clear previous markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    results.forEach(result => {
      if (result.lng && result.lat) {
        const marker = new mapboxgl.Marker({ color: getColorForCategory(category) })
          .setLngLat([result.lng, result.lat])
          .addTo(map.current!);
        markers.current.push(marker);
      }
    });

    // Draw radius circle if we have user location
    if (map.current.getSource('radius-circle')) {
      map.current.removeSource('radius-circle');
    }

    if (map.current.getLayer('radius-fill')) {
      map.current.removeLayer('radius-fill');
    }

    if (map.current.getLayer('radius-border')) {
      map.current.removeLayer('radius-border');
    }

    // Create a circle showing search radius
    if (radius > 0) {
      map.current.addSource('radius-circle', {
        type: 'geojson',
        data: createGeoJSONCircle(userLocation, radius)
      });

      map.current.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius-circle',
        paint: {
          'fill-color': '#4299e1',
          'fill-opacity': 0.1
        }
      });

      map.current.addLayer({
        id: 'radius-border',
        type: 'line',
        source: 'radius-circle',
        paint: {
          'line-color': '#4299e1',
          'line-width': 2
        }
      });
    }
  }, [results, radius, category, userLocation]);

  // Helper function to create a GeoJSON circle
  const createGeoJSONCircle = (center: [number, number], radiusInKm: number) => {
    const points = 64;
    const coords = {
      latitude: center[1],
      longitude: center[0]
    };
    
    const km = radiusInKm;
    const ret = [];
    const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]); // Close the loop

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      },
      properties: {}
    };
  };

  // Helper to get color based on category
  const getColorForCategory = (cat: string) => {
    switch (cat) {
      case 'Divertissement':
        return '#8e44ad'; 
      case 'Santé':
        return '#27ae60';
      case 'Alimentation':
        return '#e67e22';
      default:
        return '#3498db';
    }
  };

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapboxMap;
