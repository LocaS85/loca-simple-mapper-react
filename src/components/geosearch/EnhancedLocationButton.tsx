
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLocationButtonProps {
  onLocationDetected: (coordinates: [number, number]) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
  isIconOnly?: boolean;
}

export const EnhancedLocationButton: React.FC<EnhancedLocationButtonProps> = ({
  onLocationDetected,
  disabled = false,
  variant = "outline",
  size = "default",
  className = "",
  isIconOnly = false
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
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

    setIsDetecting(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
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
        description: "Votre localisation a été mise à jour avec succès",
        variant: "default",
      });
      
    } catch (error) {
      console.error('❌ Erreur de géolocalisation:', error);
      
      let errorMessage = "Impossible d'obtenir votre position";
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai de géolocalisation dépassé";
            break;
        }
      }
      
      toast({
        title: "Erreur de localisation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const renderIcon = () => {
    if (isDetecting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return isIconOnly ? <Navigation className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const renderContent = () => {
    if (isIconOnly) {
      return renderIcon();
    }
    
    return (
      <>
        {renderIcon()}
        <span className="ml-2">
          {isDetecting ? "Localisation..." : "Ma position"}
        </span>
      </>
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLocationClick}
      disabled={disabled || isDetecting}
      className={`${className} ${isDetecting ? 'cursor-wait' : ''} ${isIconOnly ? 'px-2' : ''}`}
      title="Détecter ma position"
    >
      {renderContent()}
    </Button>
  );
};

export default EnhancedLocationButton;
