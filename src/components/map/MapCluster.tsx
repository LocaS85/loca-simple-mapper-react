
import React from "react";
import { Marker } from "react-map-gl";
import { BBox } from "geojson";
import useSupercluster from "use-supercluster";
import { POI } from "@/types/map";
import POIMarker from "./POIMarker";

interface MapClusterProps {
  pointsOfInterest: POI[];
  bounds: BBox;
  zoom: number;
  showPopup: boolean;
  selectedPOI: POI | null;
  onMarkerClick: (poi: POI) => void;
  onDirectionsClick: (coordinates: [number, number]) => void;
  onClusterClick: (longitude: number, latitude: number, expansionZoom: number) => void;
  onPopupClose: () => void;
}

const MapCluster: React.FC<MapClusterProps> = ({
  pointsOfInterest,
  bounds,
  zoom,
  showPopup,
  selectedPOI,
  onMarkerClick,
  onDirectionsClick,
  onClusterClick,
  onPopupClose,
}) => {
  // Prepare points for clustering
  const points = pointsOfInterest.map(poi => ({
    type: "Feature" as const,
    properties: { 
      cluster: false, 
      poiId: poi.id, 
      poiName: poi.name,
      poiCategory: poi.category 
    },
    geometry: {
      type: "Point" as const,
      coordinates: poi.coordinates
    }
  }));

  // Use the useSupercluster hook
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  return (
    <>
      {clusters.map(cluster => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties || {};

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
                  onClusterClick(longitude, latitude, expansionZoom);
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        }

        const poiId = cluster.properties?.poiId;
        const poi = pointsOfInterest.find(p => p.id === poiId);
        
        if (!poi) return null;

        return (
          <POIMarker
            key={poi.id}
            poi={poi}
            showPopup={showPopup}
            selectedPOI={selectedPOI}
            onMarkerClick={onMarkerClick}
            onDirectionsClick={onDirectionsClick}
            onClose={onPopupClose}
          />
        );
      })}
    </>
  );
};

export default MapCluster;
