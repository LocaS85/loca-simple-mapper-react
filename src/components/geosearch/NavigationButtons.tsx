
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Navigation, MapPin } from 'lucide-react';

interface NavigationButtonsProps {
  destination: {
    lat: number;
    lng: number;
    name?: string;
  };
  origin?: {
    lat: number;
    lng: number;
  };
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  destination,
  origin,
  className = ""
}) => {
  const isMobile = /iPhone|Android/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const openGoogleMaps = () => {
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    if (origin) {
      url += `&origin=${origin.lat},${origin.lng}`;
    }
    url += `&destination=${destination.lat},${destination.lng}`;
    
    if (destination.name) {
      url += `&destination_place_id=${encodeURIComponent(destination.name)}`;
    }
    
    window.open(url, '_blank');
  };

  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${destination.lat},${destination.lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  const openAppleMaps = () => {
    let url = 'https://maps.apple.com/';
    
    if (origin) {
      url += `?saddr=${origin.lat},${origin.lng}&daddr=${destination.lat},${destination.lng}`;
    } else {
      url += `?q=${destination.lat},${destination.lng}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={openGoogleMaps}
        className="flex items-center gap-1"
      >
        <MapPin className="h-3 w-3" />
        Google Maps
      </Button>
      
      {isMobile && (
        <Button
          variant="outline"
          size="sm"
          onClick={openWaze}
          className="flex items-center gap-1"
        >
          <Navigation className="h-3 w-3" />
          Waze
        </Button>
      )}
      
      {isIOS && (
        <Button
          variant="outline"
          size="sm"
          onClick={openAppleMaps}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Plans
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
