import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';
import { getMapboxToken } from '@/utils/mapboxConfig';
import { Button } from '@/components/ui/button';
import { LocateFixed, Navigation, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapboxSearchMapProps {
  results: SearchResult[];
  userLocation?: [number, number];
  onLocationChange?: (location: [number, number]) => void;
  selectedAddresses?: string[];
  transportMode?: TransportMode;
  className?: string;
}

interface RouteResult {
  poi: SearchResult;
  durationSec: number;
  distanceM: number;
  geometry: GeoJSON.LineString;
}

const MapboxSearchMap: React.FC<MapboxSearchMapProps> = ({
  results,
  userLocation,
  onLocationChange,
  selectedAddresses = [],
  transportMode = 'walking',
  className = ''
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routesRef = useRef<string[]>([]);
  const { toast } = useToast();

  // Transport mode colors and profiles
  const transportColors = {
    walking: '#10B981', // green
    cycling: '#F59E0B', // orange
    driving: '#3B82F6', // blue
    car: '#3B82F6',
    bus: '#8B5CF6', // purple
    train: '#EF4444' // red
  };

  const getMapboxProfile = (mode: TransportMode): string => {
    const profileMap: Record<TransportMode, string> = {
      walking: 'walking',
      cycling: 'cycling',
      driving: 'driving',
      car: 'driving',
      bus: 'walking',
      train: 'walking',
      transit: 'walking'
    };
    return profileMap[mode] || 'walking';
  };

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!containerRef.current || mapRef.current) return;

      try {
        const token = await getMapboxToken();
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: userLocation || [2.3522, 48.8566],
          zoom: 12,
          attributionControl: true,
        });

        // Navigation controls
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
        map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' }));

        // Geocoder with autosuggestion
        const geocoder = new MapboxGeocoder({
          accessToken: token,
          mapboxgl,
          marker: false,
          placeholder: 'Rechercher une adresse…',
          countries: 'fr',
          language: 'fr',
          types: 'address,poi,place',
          proximity: userLocation ? { longitude: userLocation[0], latitude: userLocation[1] } : undefined
        });

        map.addControl(geocoder, 'top-left');

        geocoder.on('result', (e: any) => {
          const [lng, lat] = e.result.center;
          const newLocation: [number, number] = [lng, lat];
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
          map.flyTo({ center: [lng, lat], zoom: 14 });
        });

        // Geolocation control
        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
          showUserHeading: true
        });

        map.addControl(geolocateControl, 'top-left');

        geolocateControl.on('geolocate', (e) => {
          const newLocation: [number, number] = [e.coords.longitude, e.coords.latitude];
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
          map.flyTo({ center: newLocation, zoom: 14 });
        });

        mapRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: 'Erreur de carte',
          description: 'Impossible d\'initialiser la carte Mapbox',
          variant: 'destructive'
        });
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Remove existing user location marker
    const existingUserMarker = document.querySelector('.user-location-marker');
    if (existingUserMarker) {
      existingUserMarker.remove();
    }

    // Add user location marker
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.style.width = '20px';
    userMarkerEl.style.height = '20px';
    userMarkerEl.style.borderRadius = '50%';
    userMarkerEl.style.background = '#3B82F6';
    userMarkerEl.style.border = '3px solid white';
    userMarkerEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

    new mapboxgl.Marker({ element: userMarkerEl, anchor: 'center' })
      .setLngLat(userLocation)
      .addTo(mapRef.current);
  }, [userLocation]);

  // Update result markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for results
    results.forEach((result, index) => {
      if (!result.coordinates) return;

      const markerEl = document.createElement('div');
      markerEl.style.width = '14px';
      markerEl.style.height = '14px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.background = '#1f2937';
      markerEl.style.border = '2px solid white';
      markerEl.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat(result.coordinates)
        .addTo(mapRef.current!);

      const popupHtml = `
        <div style="font-family: system-ui; max-width: 240px">
          <div style="font-weight:600">${result.name}</div>
          <div style="font-size:12px; opacity:.8">${result.address || ''}</div>
          <div style="margin-top:6px">📍 ${result.distance?.toFixed(1)} km</div>
          <button id="nav-${index}" style="margin-top:8px;padding:6px 10px;border-radius:8px;border:1px solid #ddd;background:#fff;cursor:pointer">
            Ouvrir dans Google Maps
          </button>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(popupHtml);
      marker.setPopup(popup);

      marker.getElement().addEventListener('click', () => {
        setTimeout(() => {
          const btn = document.getElementById(`nav-${index}`);
          if (btn) {
            btn.onclick = () => {
              const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${result.coordinates[1]},${result.coordinates[0]}&travelmode=${transportMode === 'car' || transportMode === 'driving' ? 'driving' : transportMode}`;
              window.open(gmaps, '_blank', 'noopener');
            };
          }
        }, 50);
      });

      markersRef.current.push(marker);
    });
  }, [results, transportMode]);

  // Calculate and display routes to selected addresses
  useEffect(() => {
    if (!mapRef.current || !userLocation || selectedAddresses.length === 0) return;

    const calculateRoutes = async () => {
      try {
        const token = await getMapboxToken();
        const profile = getMapboxProfile(transportMode);
        const color = transportColors[transportMode] || '#10B981';

        // Clear existing routes
        routesRef.current.forEach(layerId => {
          if (mapRef.current!.getLayer(layerId)) {
            mapRef.current!.removeLayer(layerId);
          }
          if (mapRef.current!.getSource(layerId + '-source')) {
            mapRef.current!.removeSource(layerId + '-source');
          }
        });
        routesRef.current = [];

        // Filter results to selected addresses
        const selectedResults = results.filter(result => 
          selectedAddresses.includes(result.name) || selectedAddresses.includes(result.address)
        );

        // Calculate routes for each selected result
        for (const [index, result] of selectedResults.entries()) {
          if (!result.coordinates) continue;

          try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${userLocation[0]},${userLocation[1]};${result.coordinates[0]},${result.coordinates[1]}?geometries=geojson&overview=full&access_token=${token}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
              const route = data.routes[0];
              const layerId = `route-${index}`;
              const sourceId = `${layerId}-source`;

              // Add route source
              mapRef.current!.addSource(sourceId, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: route.geometry,
                  properties: {}
                }
              });

              // Add route layer
              mapRef.current!.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: {
                  'line-color': color,
                  'line-width': 5,
                  'line-opacity': 0.9
                },
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round'
                }
              });

              routesRef.current.push(layerId);
            }
          } catch (error) {
            console.error(`Error calculating route for ${result.name}:`, error);
          }
        }
      } catch (error) {
        console.error('Error calculating routes:', error);
      }
    };

    calculateRoutes();
  }, [userLocation, selectedAddresses, transportMode, results]);

  const handleMyLocationClick = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Géolocalisation non supportée',
        description: 'Votre navigateur ne supporte pas la géolocalisation',
        variant: 'destructive'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        if (onLocationChange) {
          onLocationChange(coords);
        }
        if (mapRef.current) {
          mapRef.current.flyTo({ center: coords, zoom: 14 });
        }
      },
      (error) => {
        toast({
          title: 'Erreur de géolocalisation',
          description: 'Impossible d\'obtenir votre position',
          variant: 'destructive'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Custom location button */}
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={handleMyLocationClick}
          size="sm"
          variant="outline"
          className="bg-background shadow-md"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapboxSearchMap;