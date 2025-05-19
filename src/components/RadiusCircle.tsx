
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
      // Make sure the map is still available before proceeding
      if (!map) return;
      
      // Check if the source exists before trying to update it
      let source;
      try {
        source = map.getSource(sourceId);
      } catch (error) {
        console.log("Source not found, will create it:", error);
      }
      
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
      } else {
        try {
          // Only add source if it doesn't exist
          if (!map.getSource(sourceId)) {
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
          }
          
          // Only add layer if it doesn't exist
          if (!map.getLayer(layerId)) {
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
        } catch (error) {
          console.error("Error adding source or layer:", error);
        }
      }
    }
    
    return () => {
      // Clean up safely - check map and style are still valid
      try {
        if (map && map.getStyle()) {
          // Check if layer exists before removing
          try {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
          } catch (e) {
            console.log("Layer already removed or doesn't exist:", e);
          }
          
          // Check if source exists before removing
          try {
            if (map.getSource(sourceId)) {
              map.removeSource(sourceId);
            }
          } catch (e) {
            console.log("Source already removed or doesn't exist:", e);
          }
        }
      } catch (error) {
        console.log("Cleanup error in RadiusCircle (can be ignored):", error);
      }
    };
  }, [center, radius, unit, map, mapLoaded]);

  return null; // This component doesn't render anything directly
};

export default RadiusCircle;
