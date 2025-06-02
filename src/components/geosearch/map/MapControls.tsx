
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from '@/hooks/use-toast';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { MAP_CONFIG } from './MapConfig';

interface MapControlsProps {
  map: mapboxgl.Map;
  onLocationUpdate: (coords: [number, number]) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ map, onLocationUpdate }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geolocation control
    const geolocateControl = new mapboxgl.GeolocateControl(MAP_CONFIG.geolocateOptions);
    map.addControl(geolocateControl, 'top-right');
    
    // Listen for geolocation events
    geolocateControl.on('geolocate', (e) => {
      const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
      console.log('📍 Géolocalisation mise à jour:', coords);
      
      onLocationUpdate(coords);
      
      toast({
        title: "Position mise à jour",
        description: "Votre localisation a été détectée avec succès",
        variant: "default",
      });
    });
    
    geolocateControl.on('error', (e) => {
      console.error('❌ Erreur de géolocalisation:', e);
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'obtenir votre position",
        variant: "destructive",
      });
    });

    return () => {
      // Cleanup handled by map destruction
    };
  }, [map, onLocationUpdate, toast]);

  return null;
};

export default MapControls;
