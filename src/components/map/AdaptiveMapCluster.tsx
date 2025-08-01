import React, { useMemo, useCallback } from 'react';
import { Marker } from 'react-map-gl';
import { BBox, Feature, Point } from 'geojson';
import useSupercluster from 'use-supercluster';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { POI } from '@/types/map';
import { SearchResult } from '@/types/unified';
import POIMarker from './POIMarker';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdaptiveMapClusterProps {
  pointsOfInterest: POI[];
  bounds: BBox;
  zoom: number;
  showPopup: boolean;
  selectedPOI: POI | null;
  onMarkerClick: (poi: POI) => void;
  onDirectionsClick: (coordinates: [number, number]) => void;
  onClusterClick: (longitude: number, latitude: number, expansionZoom: number) => void;
  onPopupClose: () => void;
  connectionSpeed?: 'slow' | 'fast' | 'unknown';
}

interface ClusterFeature extends Feature<Point> {
  properties: {
    cluster: boolean;
    point_count?: number;
    point_count_abbreviated?: string;
    cluster_id?: number;
    poiId?: string;
    poiName?: string;
    poiCategory?: string;
  };
}

const AdaptiveMapCluster: React.FC<AdaptiveMapClusterProps> = ({
  pointsOfInterest,
  bounds,
  zoom,
  showPopup,
  selectedPOI,
  onMarkerClick,
  onDirectionsClick,
  onClusterClick,
  onPopupClose,
  connectionSpeed = 'unknown'
}) => {
  const isMobile = useIsMobile();
  
  // Adaptive clustering configuration based on device and performance
  const clusterConfig = useMemo(() => {
    const baseRadius = isMobile ? 60 : 75;
    const speedMultiplier = connectionSpeed === 'slow' ? 1.5 : 1;
    
    return {
      radius: Math.round(baseRadius * speedMultiplier),
      maxZoom: zoom > 15 ? 20 : 16,
      minZoom: 0,
      minPoints: isMobile ? 3 : 2
    };
  }, [isMobile, connectionSpeed, zoom]);

  // Virtualization threshold - use virtualization for large datasets
  const useVirtualization = pointsOfInterest.length > 100;
  
  // Prepare points for clustering with proper GeoJSON typing
  const points: ClusterFeature[] = useMemo(() => {
    return pointsOfInterest.map((poi, index) => ({
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
    } as ClusterFeature));
  }, [pointsOfInterest]);

  // Use the useSupercluster hook with adaptive configuration
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: clusterConfig
  });

  // Category-based clustering logic
  const categorizedClusters = useMemo(() => {
    if (!supercluster) return clusters;

    return clusters.map(cluster => {
      if (!cluster.properties?.cluster) return cluster;

      // Get points in cluster to determine dominant category
      const clusterPoints = supercluster.getLeaves(
        cluster.properties.cluster_id as number,
        Infinity
      );

      const categoryCount = clusterPoints.reduce((acc, point) => {
        const category = point.properties?.poiCategory || 'general';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

      return {
        ...cluster,
        properties: {
          ...cluster.properties,
          dominantCategory
        }
      };
    });
  }, [clusters, supercluster]);

  // Get category color for clusters
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      restaurant: '#ef4444',
      shopping: '#3b82f6',
      health: '#10b981',
      transport: '#8b5cf6',
      culture: '#f59e0b',
      general: '#6b7280'
    };
    return colors[category] || colors.general;
  };

  // Cluster click handler with smooth animation
  const handleClusterClick = useCallback((
    cluster: ClusterFeature,
    longitude: number,
    latitude: number
  ) => {
    if (!supercluster || !cluster.properties?.cluster) return;

    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.properties.cluster_id as number),
      20
    );

    onClusterClick(longitude, latitude, expansionZoom);
  }, [supercluster, onClusterClick]);

  // Render cluster marker with animations
  const renderClusterMarker = useCallback((cluster: ClusterFeature) => {
    if (!cluster.properties?.cluster) return null;

    const [longitude, latitude] = cluster.geometry.coordinates;
    const pointCount = cluster.properties.point_count as number || 0;
    const category = (cluster.properties as any).dominantCategory || 'general';
    
    const size = Math.min(pointCount * 8, 60) + 30;
    const color = getCategoryColor(category);

    return (
      <Marker
        key={`cluster-${cluster.properties.cluster_id}`}
        longitude={longitude}
        latitude={latitude}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          className="relative cursor-pointer"
          onClick={() => handleClusterClick(cluster, longitude, latitude)}
        >
          {/* Main cluster circle */}
          <div 
            className="flex items-center justify-center rounded-full text-white font-semibold shadow-lg border-2 border-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              fontSize: size > 40 ? '14px' : '12px'
            }}
          >
            {pointCount > 999 ? '999+' : pointCount}
          </div>
          
          {/* Category indicator */}
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: color }}
            title={`Catégorie dominante: ${category}`}
          />
          
          {/* Pulse animation for large clusters */}
          {pointCount > 50 && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 opacity-30"
              style={{ borderColor: color }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </Marker>
    );
  }, [handleClusterClick]);

  // Render individual POI marker
  const renderPOIMarker = useCallback((cluster: ClusterFeature) => {
    if (cluster.properties?.cluster) return null;

    const poiId = cluster.properties?.poiId;
    const poi = pointsOfInterest.find(p => p.id === poiId);
    
    if (!poi) return null;

    return (
      <motion.div
        key={normalizedPOI.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          delay: Math.random() * 0.1 // Stagger animation
        }}
      >
        <POIMarker
          poi={poi}
          showPopup={showPopup}
          selectedPOI={selectedPOI}
          onMarkerClick={onMarkerClick}
          onDirectionsClick={onDirectionsClick}
          onClose={onPopupClose}
        />
      </motion.div>
    );
  }, [pointsOfInterest, showPopup, selectedPOI, onMarkerClick, onDirectionsClick, onPopupClose]);

  // Virtualized list renderer for large datasets
  const VirtualizedMarkers: React.FC<{ clusters: ClusterFeature[] }> = ({ clusters }) => {
    const itemData = clusters;
    
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const cluster = itemData[index];
      return (
        <div style={style}>
          {cluster.properties?.cluster 
            ? renderClusterMarker(cluster)
            : renderPOIMarker(cluster)
          }
        </div>
      );
    };

    return (
      <List
        height={window.innerHeight}
        width={window.innerWidth}
        itemCount={clusters.length}
        itemSize={50}
        itemData={itemData}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      >
        {Row}
      </List>
    );
  };

  // Performance monitoring
  React.useEffect(() => {
    const renderStart = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart;
      if (renderTime > 16) { // Slower than 60fps
        console.warn(`🐌 Slow cluster render: ${renderTime.toFixed(2)}ms for ${clusters.length} items`);
      }
    };
  }, [clusters.length]);

  // Render clusters with or without virtualization
  if (useVirtualization) {
    console.log(`🚀 Using virtualization for ${clusters.length} markers`);
    return <VirtualizedMarkers clusters={clusters as ClusterFeature[]} />;
  }

  return (
    <AnimatePresence mode="popLayout">
      {clusters.map(cluster => {
        const isCluster = cluster.properties?.cluster;
        return isCluster 
          ? renderClusterMarker(cluster as ClusterFeature)
          : renderPOIMarker(cluster as ClusterFeature);
      })}
    </AnimatePresence>
  );
};

export default AdaptiveMapCluster;