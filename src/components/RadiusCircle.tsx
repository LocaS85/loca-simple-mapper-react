
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface RadiusCircleProps {
  center: [number, number];
  radius: number;
  unit: 'km' | 'mi';
  map: mapboxgl.Map;
  mapLoaded: boolean;
}

const RadiusCircle: React.FC<RadiusCircleProps> = ({ center, radius, unit, map, mapLoaded }) => {
  React.useEffect(() => {
    if (!mapLoaded) return;

    const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
    
    if (map.getSource('radius')) {
      const source = map.getSource('radius');
      if (source && 'setData' in source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: radiusInMeters
          }
        });
      }
    } else {
      map.addSource('radius', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: radiusInMeters
          }
        }
      });
      
      map.addLayer({
        id: 'radius-circle',
        type: 'circle',
        source: 'radius',
        paint: {
          'circle-radius': ['get', 'radius'],
          'circle-color': '#4299e1',
          'circle-opacity': 0.15,
          'circle-stroke-color': '#4299e1',
          'circle-stroke-width': 1
        }
      });
    }
    
    return () => {
      if (map.getSource('radius')) {
        map.removeLayer('radius-circle');
        map.removeSource('radius');
      }
    };
  }, [center, radius, unit, map, mapLoaded]);

  return null; // This component doesn't render anything directly
};

export default RadiusCircle;
