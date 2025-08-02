import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Signal, Zap } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface NetworkMetrics {
  latency: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: number;
  requests: number;
  errors: number;
}

export const NetworkQualityIndicator: React.FC = () => {
  const { networkStatus } = useGeoSearchStore();
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    latency: 150,
    speed: 'medium',
    quality: 85,
    requests: 0,
    errors: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate metrics update
      setMetrics(prev => ({
        ...prev,
        latency: 100 + Math.random() * 200,
        quality: 70 + Math.random() * 30,
        requests: prev.requests + Math.floor(Math.random() * 3)
      }));
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    if (networkStatus === 'offline') return <WifiOff className="h-3 w-3" />;
    if (metrics.speed === 'fast') return <Zap className="h-3 w-3" />;
    if (metrics.speed === 'slow') return <Signal className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  const getVariant = () => {
    if (networkStatus === 'offline') return "destructive" as const;
    if (metrics.speed === 'fast' && metrics.quality > 80) return "default" as const;
    if (metrics.speed === 'slow' || metrics.quality < 50) return "secondary" as const;
    return "outline" as const;
  };

  const getStatusText = () => {
    if (networkStatus === 'offline') return "Hors ligne";
    if (metrics.requests === 0) return "En attente";
    
    const latencyText = metrics.latency < 1000 
      ? `${Math.round(metrics.latency)}ms`
      : `${(metrics.latency / 1000).toFixed(1)}s`;
    
    return `${latencyText} (${metrics.speed})`;
  };

  return (
    <Badge 
      variant={getVariant()}
      className="gap-1 text-xs px-2 py-1"
      title={`Qualité: ${Math.round(metrics.quality)}% | Requêtes: ${metrics.requests}`}
    >
      {getIcon()}
      <span className="hidden sm:inline">{getStatusText()}</span>
      
      {/* Quality bar */}
      <div className="w-6 h-1 bg-muted rounded-full overflow-hidden ml-1">
        <div 
          className="h-full transition-all duration-300" 
          style={{ 
            width: `${metrics.quality}%`,
            backgroundColor: metrics.quality > 80 ? '#10b981' : 
                           metrics.quality > 50 ? '#f59e0b' : '#ef4444'
          }} 
        />
      </div>
    </Badge>
  );
};