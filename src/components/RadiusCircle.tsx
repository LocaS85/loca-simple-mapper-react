
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
    if (!mapLoaded || !map) return;
    
    const sourceId = 'radius';
    const layerId = 'radius-circle';
    const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
    
    try {
      // Check if the map is loaded and the style is ready
      if (!map.isStyleLoaded()) {
        console.log("Map style not fully loaded, waiting for 'load' event");
        
        const onLoad = () => {
          addSourceAndLayer();
          map.off('load', onLoad);
        };
        
        map.on('load', onLoad);
        return;
      }
      
      addSourceAndLayer();
    } catch (error) {
      console.error("Error setting up radius circle:", error);
    }
    
    function addSourceAndLayer() {
      if (map.getSource(sourceId)) {
        const source = map.getSource(sourceId);
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
        map.addSource(sourceId, {
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
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': ['get', 'radius'],
            'circle-color': '#4299e1',
            'circle-opacity': 0.15,
            'circle-stroke-color': '#4299e1',
            'circle-stroke-width': 1
          }
        });
      }
    }
    
    return () => {
      try {
        // Verify map object is still valid and source/layer exist before removing
        if (map && map.getStyle() && map.getSource(sourceId)) {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          map.removeSource(sourceId);
        }
      } catch (error) {
        console.log("Cleanup error in RadiusCircle (can be ignored):", error);
      }
    };
  }, [center, radius, unit, map, mapLoaded]);

  return null; // This component doesn't render anything directly
};

export default RadiusCircle;
