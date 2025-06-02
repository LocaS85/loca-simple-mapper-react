
export const MAP_CONFIG = {
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  defaultCenter: [2.35, 48.85] as [number, number],
  defaultZoom: {
    desktop: 12,
    mobile: 10
  },
  geolocateOptions: {
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    },
    trackUserLocation: true,
    showUserHeading: true,
    showAccuracyCircle: true
  },
  routeLayerConfig: {
    id: 'route',
    type: 'line' as const,
    layout: {
      'line-join': 'round' as const,
      'line-cap': 'round' as const
    },
    paint: {
      'line-color': '#3b82f6',
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 8] as any,
      'line-opacity': 0.8
    }
  }
};
