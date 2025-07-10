import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchResult } from '@/types/geosearch';

interface ResultMarkersManagerProps {
  map: mapboxgl.Map;
  results: SearchResult[];
  userLocation: [number, number] | null;
  onResultClick: (result: SearchResult) => void;
}

const ResultMarkersManager: React.FC<ResultMarkersManagerProps> = ({
  map,
  results,
  userLocation,
  onResultClick
}) => {
  useEffect(() => {
    if (!map) return;

    // Nettoyer les anciens marqueurs
    clearExistingMarkers(map);

    // Ajouter le marqueur de position utilisateur
    if (userLocation) {
      addUserLocationMarker(map, userLocation);
    }

    // Ajouter les marqueurs de résultats
    results.forEach((result, index) => {
      addResultMarker(map, result, index, onResultClick);
    });

    return () => {
      clearExistingMarkers(map);
    };
  }, [map, results, userLocation, onResultClick]);

  return null;
};

const clearExistingMarkers = (map: mapboxgl.Map) => {
  // Supprimer les couches de marqueurs existantes
  const layers = map.getStyle().layers;
  
  layers?.forEach(layer => {
    if (layer.id.startsWith('marker-') || layer.id === 'user-location') {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    }
  });

  // Supprimer les sources de marqueurs existantes
  Object.keys(map.getStyle().sources || {}).forEach(sourceId => {
    if (sourceId.startsWith('marker-') || sourceId === 'user-location') {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    }
  });
};

const addUserLocationMarker = (map: mapboxgl.Map, location: [number, number]) => {
  const sourceId = 'user-location';
  const layerId = 'user-location';

  // Ajouter la source
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location
        },
        properties: {
          type: 'user-location'
        }
      }]
    }
  });

  // Ajouter la couche cercle externe (pulsation)
  map.addLayer({
    id: `${layerId}-pulse`,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 15,
        15, 30
      ],
      'circle-color': '#4285f4',
      'circle-opacity': 0.2,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#4285f4',
      'circle-stroke-opacity': 0.5
    }
  });

  // Ajouter la couche cercle principal
  map.addLayer({
    id: layerId,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 8,
        15, 12
      ],
      'circle-color': '#4285f4',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff'
    }
  });
};

const addResultMarker = (
  map: mapboxgl.Map,
  result: SearchResult,
  index: number,
  onResultClick: (result: SearchResult) => void
) => {
  const sourceId = `marker-${result.id}`;
  const layerId = `marker-${result.id}`;

  // Ajouter la source
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: result.coordinates
        },
        properties: {
          id: result.id,
          name: result.name,
          address: result.address,
          index: index + 1
        }
      }]
    }
  });

  // Ajouter la couche de marqueur avec numéro
  map.addLayer({
    id: layerId,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 15,
        15, 20
      ],
      'circle-color': '#ea4335',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff'
    }
  });

  // Ajouter le numéro sur le marqueur
  map.addLayer({
    id: `${layerId}-label`,
    type: 'symbol',
    source: sourceId,
    layout: {
      'text-field': (index + 1).toString(),
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 10,
        15, 14
      ],
      'text-anchor': 'center',
      'text-offset': [0, 0]
    },
    paint: {
      'text-color': '#ffffff'
    }
  });

  // Ajouter l'interaction au clic
  map.on('click', layerId, () => {
    onResultClick(result);
  });

  // Changer le curseur au survol
  map.on('mouseenter', layerId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', layerId, () => {
    map.getCanvas().style.cursor = '';
  });

  // Popup au survol
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 25
  });

  map.on('mouseenter', layerId, (e) => {
    if (e.features && e.features[0]) {
      const feature = e.features[0];
      const coordinates = feature.geometry.type === 'Point' 
        ? feature.geometry.coordinates.slice() as [number, number]
        : [0, 0] as [number, number];

      popup
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-2">
            <div class="font-medium text-sm">${result.name}</div>
            <div class="text-xs text-gray-600">${result.address || ''}</div>
            ${result.distance ? `<div class="text-xs text-blue-600 mt-1">${result.distance.toFixed(1)} km</div>` : ''}
          </div>
        `)
        .addTo(map);
    }
  });

  map.on('mouseleave', layerId, () => {
    popup.remove();
  });
};

export default ResultMarkersManager;