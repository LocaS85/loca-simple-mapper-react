import { useState, useCallback, useEffect } from 'react';
import { spatialCacheService } from '@/services/spatialCache/SpatialCacheService';
import { batchMapboxService } from '@/services/batch/BatchMapboxService';
import { isochroneCacheService } from '@/services/isochrone/IsochroneCacheService';
import { enhancedGeolocationService } from '@/services/geolocation/EnhancedGeolocationService';

interface PerformanceMetrics {
  // Cache spatial
  spatialCache: {
    hitRatio: number;
    totalQueries: number;
    averageLatency: number;
    storageUsed: number;
  };
  
  // Batch Mapbox
  batchMapbox: {
    queueSize: number;
    successRate: number;
    averageResponseTime: number;
    requestsSaved: number;
  };
  
  // Isochrone
  isochrone: {
    cacheSize: number;
    precomputedCount: number;
    interpolationAccuracy: number;
  };
  
  // Géolocalisation
  geolocation: {
    lastAccuracy: number;
    averageAccuracy: number;
    successRate: number;
    fallbackUsed: boolean;
  };
  
  // Réseau
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  
  // Performance globale
  performance: {
    memoryUsage: number;
    totalLoadTime: number;
    searchLatency: number;
    renderTime: number;
  };
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const collectMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const startTime = performance.now();
    
    try {
      // Collecte parallèle de toutes les métriques
      const [
        spatialMetrics,
        batchMetrics,
        isochroneMetrics,
        geolocationStats
      ] = await Promise.all([
        spatialCacheService.getMetrics(),
        batchMapboxService.getMetrics(),
        isochroneCacheService.getMetrics(),
        enhancedGeolocationService.getLocationQualityStats()
      ]);

      // Informations réseau (si disponibles)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const networkInfo = connection ? {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      } : {
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      };

      // Métriques de performance
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB

      const collectTime = performance.now() - startTime;

      return {
        spatialCache: {
          hitRatio: spatialMetrics.hitRatio,
          totalQueries: spatialMetrics.totalRequests,
          averageLatency: spatialMetrics.avgLatency,
          storageUsed: spatialMetrics.spatialCoverage
        },
        batchMapbox: {
          queueSize: batchMetrics.totalRequests,
          successRate: (1 - batchMetrics.errorRate) * 100,
          averageResponseTime: batchMetrics.averageLatency,
          requestsSaved: batchMetrics.batchedRequests
        },
        isochrone: {
          cacheSize: isochroneMetrics.cacheHits,
          precomputedCount: isochroneMetrics.precomputedHits,
          interpolationAccuracy: isochroneMetrics.interpolatedResults
        },
        geolocation: {
          lastAccuracy: geolocationStats.averageQuality,
          averageAccuracy: geolocationStats.averageQuality,
          successRate: geolocationStats.gpsSuccessRate * 100,
          fallbackUsed: geolocationStats.totalAttempts > 0
        },
        network: networkInfo,
        performance: {
          memoryUsage,
          totalLoadTime: collectTime,
          searchLatency: spatialMetrics.avgLatency + batchMetrics.averageLatency,
          renderTime: performance.now() % 1000 // Approximation
        }
      };
    } catch (error) {
      console.error('❌ Erreur collecte métriques:', error);
      throw error;
    }
  }, []);

  const refreshMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const newMetrics = await collectMetrics();
      setMetrics(newMetrics);
      console.log('📊 Métriques mises à jour:', newMetrics);
    } catch (error) {
      console.error('❌ Erreur refresh métriques:', error);
    } finally {
      setIsLoading(false);
    }
  }, [collectMetrics]);

  // Export des métriques
  const exportMetrics = useCallback(() => {
    if (!metrics) return;
    
    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geosearch-metrics-${new Date().toISOString()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }, [metrics]);

  // Reset des métriques
  const resetMetrics = useCallback(async () => {
    try {
      await Promise.all([
        spatialCacheService.clearCache(),
        Promise.resolve(), // batchMapboxService n'a pas de resetMetrics
        Promise.resolve(), // isochroneCacheService n'a pas de resetMetrics  
        enhancedGeolocationService.clearHistory()
      ]);
      
      await refreshMetrics();
      console.log('🔄 Métriques réinitialisées');
    } catch (error) {
      console.error('❌ Erreur reset métriques:', error);
    }
  }, [refreshMetrics]);

  // Détection de performance dégradée
  const getPerformanceAlerts = useCallback(() => {
    if (!metrics) return [];
    
    const alerts = [];
    
    if (metrics.spatialCache.hitRatio < 0.5) {
      alerts.push({
        type: 'warning',
        message: `Taux de cache faible: ${Math.round(metrics.spatialCache.hitRatio * 100)}%`
      });
    }
    
    if (metrics.batchMapbox.successRate < 90) {
      alerts.push({
        type: 'error',
        message: `Taux d'erreur Mapbox élevé: ${Math.round(100 - metrics.batchMapbox.successRate)}%`
      });
    }
    
    if (metrics.geolocation.averageAccuracy > 1000) {
      alerts.push({
        type: 'warning',
        message: `Précision géolocalisation dégradée: ${Math.round(metrics.geolocation.averageAccuracy)}m`
      });
    }
    
    if (metrics.performance.memoryUsage > 100) {
      alerts.push({
        type: 'warning',
        message: `Utilisation mémoire élevée: ${Math.round(metrics.performance.memoryUsage)}MB`
      });
    }
    
    return alerts;
  }, [metrics]);

  // Auto-refresh
  useEffect(() => {
    refreshMetrics();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(refreshMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshMetrics]);

  return {
    // État
    metrics,
    isLoading,
    autoRefresh,
    refreshInterval,
    
    // Actions
    refreshMetrics,
    setAutoRefresh,
    setRefreshInterval,
    exportMetrics,
    resetMetrics,
    
    // Utilitaires
    getPerformanceAlerts,
    collectMetrics
  };
};