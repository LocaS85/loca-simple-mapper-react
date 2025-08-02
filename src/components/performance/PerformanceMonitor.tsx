import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Trash2, Download, RefreshCw } from 'lucide-react';
import { batchMapboxService } from '@/services/batch/BatchMapboxService';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface PerformanceStats {
  batch: ReturnType<typeof batchMapboxService.getMetrics>;
  queue: ReturnType<typeof batchMapboxService.getQueueStats>;
  spatial: any; // Simplified for now
  isochrone: any; // Simplified for now  
  performance: ReturnType<typeof usePerformanceMonitor>;
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const performanceData = usePerformanceMonitor();

  const updateStats = async () => {
    try {
      setStats({
        batch: batchMapboxService.getMetrics(),
        queue: batchMapboxService.getQueueStats(),
        spatial: { cacheHits: 42, cachedItems: 156, cacheSize: 2048 }, // Mock data
        isochrone: { cachedIsochrones: 8, cacheHits: 12, cacheSize: 1024 }, // Mock data
        performance: performanceData
      });
    } catch (error) {
      console.error('Erreur mise à jour stats performance:', error);
    }
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearAllCaches = async () => {
    try {
      batchMapboxService.clearQueue();
      updateStats();
    } catch (error) {
      console.error('Erreur effacement caches:', error);
    }
  };

  const exportStats = () => {
    if (!stats) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      ...stats
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-stats-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600';
    if (value <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!stats) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <CardTitle className="text-sm">Moniteur de Performance</CardTitle>
            <div className="animate-spin rounded-full h-3 w-3 border-b border-primary ml-auto"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <CardTitle className="text-sm">Moniteur de Performance</CardTitle>
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={updateStats}
              className="h-6 px-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportStats}
              className="h-6 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllCaches}
              className="h-6 px-2 text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2"
            >
              {isExpanded ? '−' : '+'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">API Calls</div>
            <div className="font-mono text-sm">{stats.batch.totalRequests}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Cache Hits</div>
            <div className="font-mono text-sm text-green-600">{stats.spatial.cacheHits}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Queue</div>
            <div className="font-mono text-sm">{stats.queue.queueLength}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Errors</div>
            <div className="font-mono text-sm text-red-600">0</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Avg Time</div>
            <div className="font-mono text-sm text-green-600">
              {Math.round(stats.batch.totalProcessingTime / Math.max(stats.batch.totalRequests, 1))}ms
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Memory</div>
            <div className="font-mono text-sm text-green-600">
              {Math.round(stats.performance.metrics.memoryUsage)}%
            </div>
          </div>
        </div>

        {/* Detailed Stats (Expandable) */}
        {isExpanded && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            {/* Batch Service */}
            <div>
              <h4 className="text-sm font-medium mb-2">Service de Batch</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Requêtes totales:</span>
                  <span className="font-mono">{stats.batch.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps de traitement:</span>
                  <span className="font-mono">{Math.round(stats.batch.totalProcessingTime)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>En attente:</span>
                  <span className="font-mono">{stats.queue.pending}</span>
                </div>
              </div>
            </div>

            {/* Spatial Cache */}
            <div>
              <h4 className="text-sm font-medium mb-2">Cache Spatial</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Éléments cachés:</span>
                  <span className="font-mono">{stats.spatial.cachedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hits de cache:</span>
                  <span className="font-mono text-green-600">{stats.spatial.cacheHits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taille cache:</span>
                  <span className="font-mono">{(stats.spatial.cacheSize / 1024).toFixed(1)}KB</span>
                </div>
              </div>
            </div>

            {/* Isochrone Cache */}
            <div>
              <h4 className="text-sm font-medium mb-2">Cache Isochrone</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Isochrones:</span>
                  <span className="font-mono">{stats.isochrone.cachedIsochrones}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hits:</span>
                  <span className="font-mono text-green-600">{stats.isochrone.cacheHits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taille:</span>
                  <span className="font-mono">{(stats.isochrone.cacheSize / 1024).toFixed(1)}KB</span>
                </div>
              </div>
            </div>

            {/* Performance Monitor */}
            <div>
              <h4 className="text-sm font-medium mb-2">Performance Système</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span className="font-mono text-green-600">
                    {Math.round(stats.performance.metrics.fps)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Render Time:</span>
                  <span className="font-mono text-green-600">
                    {Math.round(stats.performance.metrics.renderTime)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DOM Nodes:</span>
                  <span className="font-mono">{stats.performance.metrics.domNodes}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};