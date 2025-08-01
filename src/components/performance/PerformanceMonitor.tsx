import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Database, MapPin, Signal, Wifi, RotateCcw } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface PerformanceMonitorProps {
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ className }) => {
  const {
    metrics,
    isLoading,
    refreshMetrics,
    exportMetrics,
    resetMetrics,
    getPerformanceAlerts
  } = usePerformanceMonitor();

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (metrics) {
      setAlerts(getPerformanceAlerts());
    }
  }, [metrics, getPerformanceAlerts]);

  const getStatusColor = (value: number, type: 'percentage' | 'latency' | 'quality' = 'percentage') => {
    if (type === 'percentage') {
      if (value >= 80) return 'text-green-600';
      if (value >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'latency') {
      if (value <= 100) return 'text-green-600';
      if (value <= 300) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'quality') {
      if (value >= 70) return 'text-green-600';
      if (value >= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const formatLatency = (latency: number) => {
    return latency > 1000 ? `${(latency / 1000).toFixed(1)}s` : `${Math.round(latency)}ms`;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Performance Monitor</CardTitle>
          <CardDescription>Aucune métrique disponible</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refreshMetrics}>Charger les métriques</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Monitor
        </CardTitle>
        <CardDescription>
          Surveillance temps réel des performances GIS
        </CardDescription>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={refreshMetrics}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Actualiser
          </Button>
          <Button size="sm" variant="outline" onClick={exportMetrics}>
            Exporter
          </Button>
          <Button size="sm" variant="outline" onClick={resetMetrics}>
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Alertes de performance */}
        {alerts.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Alertes Performance</h4>
            {alerts.map((alert, index) => (
              <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">• {alert}</p>
            ))}
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="spatial">Spatial</TabsTrigger>
            <TabsTrigger value="batch">Batch</TabsTrigger>
            <TabsTrigger value="isochrone">Isochrone</TabsTrigger>
            <TabsTrigger value="geolocation">Géolocalisation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cache Global */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Cache Global</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux réussite</span>
                    <span className={getStatusColor(metrics.spatialCache.hitRatio * 100)}>
                      {Math.round(metrics.spatialCache.hitRatio * 100)}%
                    </span>
                  </div>
                  <Progress value={metrics.spatialCache.hitRatio * 100} className="h-2" />
                </div>
              </div>

              {/* Batch Processing */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">Batch API</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Latence moy.</span>
                    <span className={getStatusColor(metrics.batchMapbox.averageResponseTime, 'latency')}>
                      {formatLatency(metrics.batchMapbox.averageResponseTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Queue Size</span>
                    <span>{metrics.batchMapbox.queueSize}</span>
                  </div>
                </div>
              </div>

              {/* Isochrones */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Isochrones</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache</span>
                    <span className={getStatusColor(metrics.isochrone.interpolationAccuracy)}>
                      {Math.round(metrics.isochrone.interpolationAccuracy)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Size</span>
                    <span>{metrics.isochrone.cacheSize}</span>
                  </div>
                </div>
              </div>

              {/* Géolocalisation */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Signal className="h-4 w-4" />
                  <span className="font-medium">Position</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Qualité</span>
                    <span className={getStatusColor(metrics.geolocation.successRate * 100, 'quality')}>
                      {Math.round(metrics.geolocation.successRate * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Précision</span>
                    <span>{Math.round(metrics.geolocation.averageAccuracy)}m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseau */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-4 w-4" />
                <span className="font-medium">État Réseau</span>
                <Badge variant="default">
                  En ligne
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{metrics.network.effectiveType || 'Inconnu'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Débit:</span>
                  <p className="font-medium">{metrics.network.downlink ? `${metrics.network.downlink} Mbps` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RTT:</span>
                  <p className="font-medium">{metrics.network.rtt ? `${metrics.network.rtt}ms` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Économie données:</span>
                  <p className="font-medium">{metrics.network.saveData ? 'Activée' : 'Désactivée'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spatial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Cache Spatial</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Taux de réussite</span>
                    <span className={getStatusColor(metrics.spatialCache.hitRatio * 100)}>
                      {Math.round(metrics.spatialCache.hitRatio * 100)}%
                    </span>
                  </div>
                  <Progress value={metrics.spatialCache.hitRatio * 100} />
                  
                  <div className="flex justify-between">
                    <span>Latence moyenne</span>
                    <span className={getStatusColor(metrics.spatialCache.averageLatency, 'latency')}>
                      {formatLatency(metrics.spatialCache.averageLatency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total requêtes</span>
                    <span>{metrics.spatialCache.totalQueries}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Statistiques</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Storage utilisé</span>
                    <span className="text-green-600">{Math.round(metrics.spatialCache.storageUsed / 1024)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hit Ratio</span>
                    <span className="text-green-600">{Math.round(metrics.spatialCache.hitRatio * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Queries</span>
                    <span>{metrics.spatialCache.totalQueries} requêtes</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Traitement par lots</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Temps de réponse moyen</span>
                    <span className={getStatusColor(metrics.batchMapbox.averageResponseTime, 'latency')}>
                      {formatLatency(metrics.batchMapbox.averageResponseTime)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Queue Size</span>
                    <span>{metrics.batchMapbox.queueSize}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Taux de succès</span>
                    <span className="text-green-600">{Math.round(metrics.batchMapbox.successRate * 100)}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Requêtes économisées</span>
                    <span className="text-green-600">{metrics.batchMapbox.requestsSaved}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux de succès</span>
                    <span className={getStatusColor(metrics.batchMapbox.successRate * 100)}>
                      {Math.round(metrics.batchMapbox.successRate * 100)}%
                    </span>
                  </div>
                  <Progress value={metrics.batchMapbox.successRate * 100} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="isochrone" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Isochrones</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cache Size</span>
                    <span className={getStatusColor(80)}>
                      {metrics.isochrone.cacheSize} entrées
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Précomputées</span>
                    <span>{metrics.isochrone.precomputedCount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Précision interpolation</span>
                    <span className={getStatusColor(metrics.isochrone.interpolationAccuracy, 'percentage')}>
                      {Math.round(metrics.isochrone.interpolationAccuracy)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geolocation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Géolocalisation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Taux de succès</span>
                    <span className={getStatusColor(metrics.geolocation.successRate * 100, 'quality')}>
                      {Math.round(metrics.geolocation.successRate * 100)}%
                    </span>
                  </div>
                  <Progress value={metrics.geolocation.successRate * 100} />
                  
                  <div className="flex justify-between">
                    <span>Précision moyenne</span>
                    <span>{Math.round(metrics.geolocation.averageAccuracy)}m</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Dernière précision</span>
                    <span>{Math.round(metrics.geolocation.lastAccuracy)}m</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Fallback utilisé</span>
                    <Badge variant={metrics.geolocation.fallbackUsed ? 'secondary' : 'default'}>
                      {metrics.geolocation.fallbackUsed ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};