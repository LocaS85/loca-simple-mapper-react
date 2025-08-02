import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

export const GeolocationStatus: React.FC = () => {
  const { userLocation, networkStatus } = useGeoSearchStore();

  const getStatusIcon = () => {
    if (networkStatus === 'offline') return <WifiOff className="h-3 w-3 text-destructive" />;
    if (networkStatus === 'slow') return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    if (userLocation) return <CheckCircle className="h-3 w-3 text-green-500" />;
    return <MapPin className="h-3 w-3 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (networkStatus === 'offline') return "Hors ligne";
    if (networkStatus === 'slow') return "Connexion lente";
    if (userLocation) return "Position OK";
    return "Aucune position";
  };

  const getVariant = () => {
    if (networkStatus === 'offline') return "destructive" as const;
    if (networkStatus === 'slow') return "secondary" as const;
    if (userLocation) return "default" as const;
    return "outline" as const;
  };

  return (
    <Badge 
      variant={getVariant()}
      className="gap-1 text-xs px-2 py-1"
      title={`État: ${getStatusText()}`}
    >
      {getStatusIcon()}
      <span className="hidden sm:inline">{getStatusText()}</span>
    </Badge>
  );
};