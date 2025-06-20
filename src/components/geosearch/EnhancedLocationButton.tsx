
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLocationButtonProps {
  onLocationDetected: (coordinates: [number, number]) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const EnhancedLocationButton: React.FC<EnhancedLocationButtonProps> = ({
  onLocationDetected,
  disabled = false,
  variant = "default",
  size = "default",
  className = ""
}) => {
  const [isGeolocating, setIsGeolocating] = useState(false);
  const { toast } = useToast();

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      const fallbackCoords: [number, number] = [2.3522, 48.8566];
      onLocationDetected(fallbackCoords);
      return;
    }

    setIsGeolocating(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 20000, // Augmenter le timeout à 20 secondes
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const coordinates: [number, number] = [
        position.coords.longitude,
        position.coords.latitude
      ];

      console.log('📍 Position détectée avec succès:', coordinates);
      onLocationDetected(coordinates);
      
      toast({
        title: "Position détectée",
        description: `Position: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`,
      });

    } catch (error) {
      console.error('❌ Erreur de géolocalisation:', error);
      
      let errorMessage = "Impossible d'obtenir votre position";
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée. Utilisation de Paris par défaut.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible. Utilisation de Paris par défaut.";
            break;
          case error.TIMEOUT:
            errorMessage = "Timeout de géolocalisation. Utilisation de Paris par défaut.";
            break;
        }
      }
      
      const fallbackCoords: [number, number] = [2.3522, 48.8566];
      console.log('📍 Utilisation position par défaut:', fallbackCoords);
      onLocationDetected(fallbackCoords);
      
      toast({
        title: "Position par défaut",
        description: errorMessage,
        variant: "default",
      });
    } finally {
      setIsGeolocating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLocationClick}
      disabled={disabled || isGeolocating}
      className={`flex items-center gap-2 ${className}`}
    >
      {isGeolocating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Navigation className="h-4 w-4" />
      )}
      {size !== "icon" && (
        <span>
          {isGeolocating ? "Localisation..." : "Ma position"}
        </span>
      )}
    </Button>
  );
};

export default EnhancedLocationButton;
