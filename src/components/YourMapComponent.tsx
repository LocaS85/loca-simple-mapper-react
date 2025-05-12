
import React, { useRef, useState, useCallback, useEffect } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  Marker,
  MapRef,
  Popup,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import useSupercluster from "use-supercluster";
import { BBox } from "geojson";

import { getMapboxToken } from "@/utils/mapboxConfig";

// Type for POI (Points of Interest)
type POI = {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number]; // [longitude, latitude]
};

type YourMapComponentProps = {
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  pois?: POI[];
};

const YourMapComponent: React.FC<YourMapComponentProps> = ({
  initialViewState = {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 11,
  },
  pois = [],
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialViewState);
  const [viewState, setViewState] = useState({
    ...initialViewState,
    width: "100%",
    height: "100%",
    bearing: 0,
    pitch: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  // Add some sample POIs if none are provided
  const [pointsOfInterest, setPointsOfInterest] = useState<POI[]>(
    pois.length > 0 ? pois : [
      { id: "1", name: "Tour Eiffel", category: "Monument", coordinates: [2.2945, 48.8584] },
      { id: "2", name: "Musée du Louvre", category: "Musée", coordinates: [2.3376, 48.8606] },
      { id: "3", name: "Notre-Dame", category: "Monument", coordinates: [2.3499, 48.8529] },
      { id: "4", name: "Centre Pompidou", category: "Musée", coordinates: [2.3522, 48.8606] },
      { id: "5", name: "Sacré-Cœur", category: "Monument", coordinates: [2.3431, 48.8867] },
      { id: "6", name: "Arc de Triomphe", category: "Monument", coordinates: [2.295, 48.8738] },
      { id: "7", name: "Montparnasse", category: "Quartier", coordinates: [2.3265, 48.8425] },
      { id: "8", name: "Jardin du Luxembourg", category: "Parc", coordinates: [2.3371, 48.8462] },
      { id: "9", name: "Opéra Garnier", category: "Monument", coordinates: [2.3316, 48.8719] },
      { id: "10", name: "La Défense", category: "Quartier", coordinates: [2.2376, 48.8908] },
    ]
  );

  // Prepare points for clustering
  const points = pointsOfInterest.map(poi => ({
    type: "Feature",
    properties: { 
      cluster: false, 
      poiId: poi.id, 
      poiName: poi.name,
      poiCategory: poi.category 
    },
    geometry: {
      type: "Point",
      coordinates: poi.coordinates
    }
  }));

  // Get map bounds
  const getBounds = (): BBox => {
    if (!mapRef.current) return [-180, -85, 180, 85];
    
    const bounds = mapRef.current.getMap().getBounds().toArray();
    return [
      bounds[0][0], // westLng - min Lng
      bounds[0][1], // southLat - min Lat
      bounds[1][0], // eastLng - max Lng
      bounds[1][1], // northLat - max Lat
    ];
  };

  // Use the useSupercluster hook to get clusters based on zoom and bounds
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: getBounds(),
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const handleMapClick = useCallback((event: any) => {
    // Close popup if it's open
    if (showPopup) {
      setShowPopup(false);
      return;
    }
    
    const [lng, lat] = event.lngLat.toArray();
    setSelectedLocation({ ...selectedLocation, latitude: lat, longitude: lng });
  }, [selectedLocation, showPopup]);

  // Initialize Mapbox Directions and Geocoder
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    // Add directions control
    const directionsControl = new MapboxDirections({
      accessToken: getMapboxToken(),
      unit: 'metric',
      profile: 'mapbox/driving',
      alternatives: true,
      congestion: true,
      language: 'fr-FR',
      controls: {
        inputs: true,
        instructions: false,
        profileSwitcher: true
      }
    });
    map.addControl(directionsControl, 'top-left');

    // Add geocoder control for searching addresses
    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      mapboxgl: mapRef.current.getMap().constructor,
      placeholder: 'Rechercher une adresse...',
      language: 'fr-FR',
      countries: 'fr',
      proximity: {
        longitude: initialViewState.longitude,
        latitude: initialViewState.latitude
      }
    });
    map.addControl(geocoder);

    return () => {
      if (map.hasControl(directionsControl)) {
        map.removeControl(directionsControl);
      }
      if (map.hasControl(geocoder)) {
        map.removeControl(geocoder);
      }
    };
  }, [initialViewState]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] rounded-2xl overflow-hidden shadow-xl">
      <Map
        ref={mapRef}
        mapboxAccessToken={getMapboxToken()}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={initialViewState}
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {/* UI controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl 
          position="top-right" 
          trackUserLocation 
          showUserHeading
        />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {/* Marker clusters */}
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
              >
                <div 
                  className="flex items-center justify-center bg-blue-500 text-white rounded-full cursor-pointer"
                  style={{
                    width: `${Math.min(pointCount * 10, 40) + 20}px`,
                    height: `${Math.min(pointCount * 10, 40) + 20}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster?.getClusterExpansionZoom(cluster.id as number) || 0,
                      20
                    );
                    mapRef.current?.flyTo({
                      center: [longitude, latitude],
                      zoom: expansionZoom,
                      duration: 800
                    });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          const poiId = cluster.properties.poiId;
          const poi = pointsOfInterest.find(p => p.id === poiId);
          
          if (!poi) return null;

          return (
            <Marker
              key={poi.id}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedPOI(poi);
                setShowPopup(true);
              }}
            >
              <div className="marker-poi">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center
                  ${poi.category === 'Monument' ? 'bg-red-500' : 
                    poi.category === 'Musée' ? 'bg-purple-500' :
                    poi.category === 'Parc' ? 'bg-green-500' :
                    'bg-blue-500'}`}>
                  <span className="text-white text-xs font-bold">
                    {poi.category === 'Monument' ? '🏛️' : 
                     poi.category === 'Musée' ? '🖼️' :
                     poi.category === 'Parc' ? '🌳' :
                     '📍'}
                  </span>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Popup for selected POI */}
        {showPopup && selectedPOI && (
          <Popup
            longitude={selectedPOI.coordinates[0]}
            latitude={selectedPOI.coordinates[1]}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            closeButton={true}
            className="z-10"
          >
            <div className="p-2">
              <h3 className="font-bold text-sm">{selectedPOI.name}</h3>
              <p className="text-xs text-gray-600">{selectedPOI.category}</p>
              <button
                className="text-xs text-blue-600 mt-1"
                onClick={() => {
                  // Get the directions control and set the destination
                  const directionsControl = mapRef.current?.getMap()._controls.find(
                    (control: any) => control instanceof MapboxDirections
                  );
                  
                  if (directionsControl) {
                    directionsControl.setOrigin([selectedLocation.longitude, selectedLocation.latitude]);
                    directionsControl.setDestination(selectedPOI.coordinates);
                  }
                }}
              >
                Obtenir l'itinéraire
              </button>
            </div>
          </Popup>
        )}

        {/* Marker for clicked location */}
        <Marker
          longitude={selectedLocation.longitude}
          latitude={selectedLocation.latitude}
          color="#3b82f6"
          draggable
          onDragEnd={(e) => {
            setSelectedLocation({
              ...selectedLocation,
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
            });
          }}
        />
      </Map>
    </div>
  );
};

export default YourMapComponent;
