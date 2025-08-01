import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { spatialCacheService } from '@/services/spatialCache/SpatialCacheService';
import { batchMapboxService } from '@/services/batch/BatchMapboxService';
import { isochroneCacheService } from '@/services/isochrone/IsochroneCacheService';
import { enhancedGeolocationService } from '@/services/geolocation/EnhancedGeolocationService';
import { 
  Activity, 
  Database, 
  MapPin, 
  Zap, 
  Clock, 
  TrendingUp,
  Wifi,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  spatial: {
    hitRatio: number;
    avgLatency: number;
    totalRequests: number;
    cacheHits: number;
    spatialCoverage: number;
  };
  batch: {
    totalRequests: number;
    batchedRequests: number;
    averageBatchSize: number;
    compressionRatio: number;
    averageLatency: number;
    errorRate: number;
  };
  isochrone: {
    hitRatio: number;
    totalRequests: number;
    cacheHits: number;
    precomputedHits: number;
    interpolatedResults: number;
    averageResponseTime: number;
  };
  geolocation: {
    averageQuality: number;
    gpsSuccessRate: number;
    totalAttempts: number;
  };
  network: {
    status: 'online' | 'offline' | 'slow';
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const collectMetrics = async () => {
    try {
      setIsLoading(true);
      
      const [spatialMetrics, batchMetrics, isochroneMetrics, geolocationStats] = await Promise.all([
        spatialCacheService.getMetrics(),
        batchMapboxService.getMetrics(),
        isochroneCacheService.getMetrics(),
        enhancedGeolocationService.getLocationQualityStats()
      ]);

      // Network information (if available)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const networkMetrics = {
        status: navigator.onLine ? 'online' : 'offline',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0
      } as const;

      setMetrics({
        spatial: spatialMetrics,
        batch: batchMetrics,
        isochrone: isochroneMetrics,
        geolocation: geolocationStats,
        network: networkMetrics
      });

      console.log('📊 Performance metrics collected');
      
    } catch (error) {
      console.error('❌ Error collecting metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    collectMetrics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(collectMetrics, 5000); // Refresh every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (value: number, type: 'percentage' | 'latency' | 'quality'): string => {
    switch (type) {
      case 'percentage':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      case 'latency':
        if (value <= 100) return 'text-green-600';
        if (value <= 500) return 'text-yellow-600';
        return 'text-red-600';
      case 'quality':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatLatency = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (isLoading || !metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Chargement des métriques...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring Performance GIS
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manuel'}
              </Button>
              <Button variant="outline" size="sm" onClick={collectMetrics}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Actualiser
              </Button>
            </div>
          </div>
          
          {/* Network status */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>Réseau:</span>
              <Badge variant={metrics.network.status === 'online' ? 'default' : 'destructive'}>
                {metrics.network.status}
              </Badge>
              {metrics.network.effectiveType !== 'unknown' && (
                <span>({metrics.network.effectiveType})</span>
              )}
            </div>
            {metrics.network.downlink > 0 && (
              <span>↓ {metrics.network.downlink} Mbps</span>
            )}
            {metrics.network.rtt > 0 && (
              <span>RTT: {metrics.network.rtt}ms</span>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="spatial">Cache Spatial</TabsTrigger>
          <TabsTrigger value="batch">Batch Mapbox</TabsTrigger>
          <TabsTrigger value="isochrone">Isochrones</TabsTrigger>
          <TabsTrigger value="geolocation">Géolocalisation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Cache Spatial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className={getStatusColor(metrics.spatial.hitRatio * 100, 'percentage')}>
                    {Math.round(metrics.spatial.hitRatio * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hit ratio ({metrics.spatial.cacheHits}/{metrics.spatial.totalRequests})
                </p>
                <Progress value={metrics.spatial.hitRatio * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Batch Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className={getStatusColor(metrics.batch.compressionRatio * 100, 'percentage')}>
                    {Math.round(metrics.batch.compressionRatio * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compression ratio
                </p>
                <Progress value={metrics.batch.compressionRatio * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Isochrones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className={getStatusColor(metrics.isochrone.averageResponseTime, 'latency')}>
                    {formatLatency(metrics.isochrone.averageResponseTime)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Temps de réponse moyen
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Géolocalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className={getStatusColor(metrics.geolocation.averageQuality, 'quality')}>
                    {metrics.geolocation.averageQuality}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Qualité moyenne ({metrics.geolocation.totalAttempts} tentatives)
                </p>
                <Progress value={metrics.geolocation.averageQuality} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spatial Cache Tab */}
        <TabsContent value="spatial">
          <Card>
            <CardHeader>
              <CardTitle>Cache Spatial - Métriques Détaillées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Hit Ratio</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(metrics.spatial.hitRatio * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Latence Moyenne</p>
                  <p className="text-2xl font-bold">{formatLatency(metrics.spatial.avgLatency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Couverture Spatiale</p>
                  <p className="text-2xl font-bold">{metrics.spatial.spatialCoverage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Requêtes</p>
                  <p className="text-2xl font-bold">{metrics.spatial.totalRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cache Hits</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.spatial.cacheHits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cache Miss</p>
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.spatial.totalRequests - metrics.spatial.cacheHits}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Performance du Cache</p>
                <Progress value={metrics.spatial.hitRatio * 100} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Processing Tab */}
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Mapbox - Optimisation des Requêtes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Taille Batch Moyenne</p>
                  <p className="text-2xl font-bold">{metrics.batch.averageBatchSize.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ratio Compression</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(metrics.batch.compressionRatio * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Taux d'Erreur</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(metrics.batch.errorRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Requêtes Totales</p>
                  <p className="text-2xl font-bold">{metrics.batch.totalRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Batches Créés</p>
                  <p className="text-2xl font-bold">{metrics.batch.batchedRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Latence Moyenne</p>
                  <p className="text-2xl font-bold">{formatLatency(metrics.batch.averageLatency)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Efficacité du Batching</p>
                <Progress value={metrics.batch.compressionRatio * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((1 - metrics.batch.compressionRatio) * metrics.batch.totalRequests)} requêtes économisées
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Isochrone Tab */}
        <TabsContent value="isochrone">
          <Card>
            <CardHeader>
              <CardTitle>Cache Isochrones - Performance Avancée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Hit Ratio</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(metrics.isochrone.hitRatio * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Temps Réponse</p>
                  <p className="text-2xl font-bold">{formatLatency(metrics.isochrone.averageResponseTime)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Interpolations</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.isochrone.interpolatedResults}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Requêtes</p>
                  <p className="text-2xl font-bold">{metrics.isochrone.totalRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cache Hits</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.isochrone.cacheHits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Précalculées</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.isochrone.precomputedHits}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-1">Performance Cache</p>
                  <Progress value={metrics.isochrone.hitRatio * 100} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Optimisations Avancées</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {metrics.isochrone.interpolatedResults} interpolées
                    </Badge>
                    <Badge variant="secondary">
                      {metrics.isochrone.precomputedHits} précalculées
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geolocation Tab */}
        <TabsContent value="geolocation">
          <Card>
            <CardHeader>
              <CardTitle>Géolocalisation Avancée - Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Qualité Moyenne</p>
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.geolocation.averageQuality}%
                  </p>
                  <Progress value={metrics.geolocation.averageQuality} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm font-medium">Taux Succès GPS</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.geolocation.gpsSuccessRate}%
                  </p>
                  <Progress value={metrics.geolocation.gpsSuccessRate} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Tentatives</p>
                  <p className="text-2xl font-bold">{metrics.geolocation.totalAttempts}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Historique disponible
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Fiabilité de Géolocalisation</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>GPS</span>
                    <span>{metrics.geolocation.gpsSuccessRate}%</span>
                  </div>
                  <Progress value={metrics.geolocation.gpsSuccessRate} />
                  
                  <div className="flex justify-between text-xs">
                    <span>Qualité globale</span>
                    <span>{metrics.geolocation.averageQuality}%</span>
                  </div>
                  <Progress value={metrics.geolocation.averageQuality} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};