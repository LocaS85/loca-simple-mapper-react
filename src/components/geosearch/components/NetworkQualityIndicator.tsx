import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const NetworkQualityIndicator: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Récupération des informations réseau
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getQualityLevel = (): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' => {
    if (!isOnline) return 'offline';
    if (!networkInfo) return 'fair';

    const { effectiveType, downlink, rtt } = networkInfo;

    if (effectiveType === '4g' && downlink > 5 && rtt < 100) return 'excellent';
    if (effectiveType === '4g' || (downlink > 2 && rtt < 200)) return 'good';
    if (effectiveType === '3g' || rtt < 500) return 'fair';
    return 'poor';
  };

  const getStatusIcon = () => {
    const quality = getQualityLevel();
    
    switch (quality) {
      case 'offline':
        return <WifiOff className="h-3 w-3" />;
      case 'excellent':
        return <Zap className="h-3 w-3" />;
      case 'poor':
        return <Clock className="h-3 w-3" />;
      default:
        return <Wifi className="h-3 w-3" />;
    }
  };

  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' => {
    const quality = getQualityLevel();
    
    switch (quality) {
      case 'offline':
      case 'poor':
        return 'destructive';
      case 'fair':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    const quality = getQualityLevel();
    
    switch (quality) {
      case 'offline':
        return 'Hors ligne';
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bon';
      case 'fair':
        return 'Correct';
      case 'poor':
        return 'Lent';
      default:
        return 'Inconnu';
    }
  };

  const getTooltipContent = () => {
    const parts = [];
    
    if (!isOnline) {
      parts.push('Connexion réseau indisponible');
      return parts.join('\n');
    }
    
    if (networkInfo) {
      parts.push(`Type: ${networkInfo.effectiveType.toUpperCase()}`);
      
      if (networkInfo.downlink > 0) {
        parts.push(`Débit: ${networkInfo.downlink} Mbps`);
      }
      
      if (networkInfo.rtt > 0) {
        parts.push(`Latence: ${networkInfo.rtt} ms`);
      }
      
      if (networkInfo.saveData) {
        parts.push('Mode économie données activé');
      }
    } else {
      parts.push('Informations réseau non disponibles');
    }
    
    return parts.join('\n');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getStatusVariant()}
            className="flex items-center gap-1 text-xs cursor-help"
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="whitespace-pre-line text-xs">
            {getTooltipContent()}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};