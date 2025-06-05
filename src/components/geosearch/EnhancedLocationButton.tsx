
import React, { useState } from 'react';
import { MapPin, Loader2, Navigation, Target } from 'lucide-react';
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

      console.log('📍 Position détectée:', coordinates);
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
    return <Target className="h-4 w-4" />;
  };

  const getButtonText = () => {
    if (isDetecting) return "Détection...";
    if (hasPermission === false) return "Autoriser";
    return "Ma position";
  };

  return (
    <Button
      onClick={requestLocation}
      disabled={disabled || isDetecting}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${className}`}
    >
      {getButtonIcon()}
      <span className="hidden sm:inline">{getButtonText()}</span>
    </Button>
  );
};

export default EnhancedLocationButton;
