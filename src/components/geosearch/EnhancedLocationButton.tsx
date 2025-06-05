
import React, { useState } from 'react';
import { Loader2, Navigation, Target, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLocationButtonProps {
  onLocationDetected: (coordinates: [number, number]) => void;
  className?: string;
  disabled?: boolean;
}

const EnhancedLocationButton: React.FC<EnhancedLocationButtonProps> = ({
  onLocationDetected,
  className = '',
  disabled = false
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { toast } = useToast();

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);

    try {
      // Vérifier les permissions d'abord
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setHasPermission(permission.state === 'granted');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
          }
        );
      });

      const coordinates: [number, number] = [
        position.coords.longitude,
        position.coords.latitude
      ];

      setAccuracy(position.coords.accuracy);
      console.log('📍 Position détectée:', coordinates, 'Précision:', position.coords.accuracy);
      onLocationDetected(coordinates);

      toast({
        title: "Position détectée",
        description: `Précision: ${Math.round(position.coords.accuracy)}m`,
        variant: "default",
      });

    } catch (error: any) {
      console.error('❌ Erreur de géolocalisation:', error);
      
      let errorMessage = "Impossible d'obtenir votre position";
      let errorTitle = "Erreur de localisation";

      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = "Géolocalisation refusée. Autorisez l'accès dans les paramètres du navigateur.";
          errorTitle = "Permission refusée";
          setHasPermission(false);
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = "Position indisponible. Vérifiez votre connexion GPS.";
          errorTitle = "Position indisponible";
          break;
        case 3: // TIMEOUT
          errorMessage = "Délai d'attente dépassé. Réessayez.";
          errorTitle = "Délai dépassé";
          break;
        default:
          errorMessage = "Erreur inconnue lors de la géolocalisation.";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const getButtonIcon = () => {
    if (isDetecting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (hasPermission === false) {
      return <Navigation className="h-4 w-4" />;
    }
    if (accuracy && accuracy < 50) {
      return <Crosshair className="h-4 w-4 text-green-600" />;
    }
    return <Target className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (accuracy && accuracy < 50) return "default";
    if (hasPermission === false) return "destructive";
    return "outline";
  };

  return (
    <Button
      onClick={requestLocation}
      disabled={disabled || isDetecting}
      variant={getButtonVariant() as any}
      size="sm"
      className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md ${className}`}
      title="Ma position"
    >
      {getButtonIcon()}
    </Button>
  );
};

export default EnhancedLocationButton;
