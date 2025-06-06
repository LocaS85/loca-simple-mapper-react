
import React, { useState } from 'react';
import { Loader2, Navigation, Target, Crosshair, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface EnhancedLocationButtonProps {
  onLocationDetected: (coordinates: [number, number]) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'icon' | 'text';
  size?: 'sm' | 'default' | 'lg';
}

const EnhancedLocationButton: React.FC<EnhancedLocationButtonProps> = ({
  onLocationDetected,
  className = '',
  disabled = false,
  variant = 'icon',
  size = 'sm'
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { toast } = useToast();
  const { userLocation, setUserLocation } = useGeoSearchStore();

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);

    try {
      // Check permissions first
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
      console.log('📍 Position detected:', coordinates, 'Accuracy:', position.coords.accuracy);
      
      // Update store
      setUserLocation(coordinates);
      onLocationDetected(coordinates);

      toast({
        title: "Position detected",
        description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
        variant: "default",
      });

    } catch (error: any) {
      console.error('❌ Geolocation error:', error);
      
      let errorMessage = "Unable to get your position";
      let errorTitle = "Location error";

      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = "Geolocation denied. Allow access in browser settings.";
          errorTitle = "Permission denied";
          setHasPermission(false);
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = "Position unavailable. Check your GPS connection.";
          errorTitle = "Position unavailable";
          break;
        case 3: // TIMEOUT
          errorMessage = "Timeout exceeded. Try again.";
          errorTitle = "Timeout";
          break;
        default:
          errorMessage = "Unknown geolocation error.";
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
    if (userLocation) {
      return <MapPin className="h-4 w-4 text-blue-600" />;
    }
    return <Target className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (accuracy && accuracy < 50) return "default";
    if (hasPermission === false) return "destructive";
    if (userLocation) return "default";
    return "outline";
  };

  const getButtonText = () => {
    if (isDetecting) return "Detecting...";
    if (userLocation) return "Update location";
    return "My location";
  };

  if (variant === 'text') {
    return (
      <Button
        onClick={requestLocation}
        disabled={disabled || isDetecting}
        variant={getButtonVariant() as any}
        size={size}
        className={`${className} bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md`}
        title="Get my location"
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={requestLocation}
      disabled={disabled || isDetecting}
      variant={getButtonVariant() as any}
      size={size}
      className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md ${className}`}
      title="My location"
    >
      {getButtonIcon()}
    </Button>
  );
};

export default EnhancedLocationButton;
