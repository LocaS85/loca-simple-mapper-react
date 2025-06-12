
import { useState, useCallback } from 'react';

export const useMapSettings = () => {
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState<[number, number]>([2.3522, 48.8566]); // Paris par défaut

  const updateMapZoom = useCallback((zoom: number) => {
    setMapZoom(zoom);
  }, []);

  const updateMapCenter = useCallback((center: [number, number]) => {
    setMapCenter(center);
  }, []);

  return {
    mapZoom,
    setMapZoom: updateMapZoom,
    mapCenter,
    setMapCenter: updateMapCenter
  };
};
