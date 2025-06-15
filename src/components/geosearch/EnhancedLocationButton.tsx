
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
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });

      const coordinates: [number, number] = [
        position.coords.longitude,
        position.coords.latitude
      ];

      onLocationDetected(coordinates);
      
      toast({
        title: "Position détectée",
        description: "Votre position a été détectée avec succès",
      });

    } catch (error) {
      console.error('Geolocation error:', error);
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir votre position actuelle",
        variant: "destructive",
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
