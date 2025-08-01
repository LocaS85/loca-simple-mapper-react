import React from 'react';
import { MapPin, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEnhancedGeolocation } from '@/hooks/useEnhancedGeolocation';

export const GeolocationStatus: React.FC = () => {
  const { 
    coordinates: currentLocation, 
    isLoading, 
    error, 
    accuracy,
    getQualityStats 
  } = useEnhancedGeolocation();

  const qualityStats = getQualityStats();
  
  const getStatusIcon = () => {
    if (isLoading) return <MapPin className="h-3 w-3 animate-pulse" />;
    if (error) return <AlertTriangle className="h-3 w-3" />;
    if (!currentLocation) return <WifiOff className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' => {
    if (error) return 'destructive';
    if (!currentLocation) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (isLoading) return 'Localisation...';
    if (error) return 'Erreur GPS';
    if (!currentLocation) return 'Pas de position';
    if (accuracy && accuracy < 50) return 'Précis';
    if (accuracy && accuracy < 100) return 'Bon';
    return 'Approximatif';
  };

  const getTooltipContent = () => {
    const parts = [];
    
    if (currentLocation) {
      parts.push(`Position: ${currentLocation[1].toFixed(4)}, ${currentLocation[0].toFixed(4)}`);
    }
    
    if (accuracy) {
      parts.push(`Précision: ±${Math.round(accuracy)}m`);
    }
    
    if (qualityStats.gpsSuccessRate > 0) {
      parts.push(`Taux succès: ${Math.round(qualityStats.gpsSuccessRate * 100)}%`);
      parts.push(`Qualité moyenne: ${Math.round(qualityStats.averageQuality * 100)}%`);
    }
    
    if (qualityStats.totalAttempts > 5) {
      parts.push('Géolocalisation IP utilisée');
    }
    
    if (error) {
      parts.push(`Erreur: ${error}`);
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