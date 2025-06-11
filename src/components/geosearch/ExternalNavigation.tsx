
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, ExternalLink, MapPin, Car } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface ExternalNavigationProps {
  result: SearchResult;
  userLocation?: [number, number];
  className?: string;
}

const ExternalNavigation: React.FC<ExternalNavigationProps> = ({
  result,
  userLocation,
  className = ""
}) => {
  const generateGoogleMapsUrl = (destination: [number, number], origin?: [number, number]) => {
    const baseUrl = 'https://www.google.com/maps/dir/';
    
    if (origin) {
      return `${baseUrl}${origin[1]},${origin[0]}/${destination[1]},${destination[0]}`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${destination[1]},${destination[0]}`;
    }
  };

  const generateWazeUrl = (destination: [number, number]) => {
    return `https://waze.com/ul?ll=${destination[1]},${destination[0]}&navigate=yes`;
  };

  const generateAppleMapsUrl = (destination: [number, number], origin?: [number, number]) => {
    if (origin) {
      return `https://maps.apple.com/?saddr=${origin[1]},${origin[0]}&daddr=${destination[1]},${destination[0]}`;
    } else {
      return `https://maps.apple.com/?q=${destination[1]},${destination[0]}`;
    }
  };

  const openNavigation = (type: 'google' | 'waze' | 'apple') => {
    let url = '';
    
    switch (type) {
      case 'google':
        url = generateGoogleMapsUrl(result.coordinates, userLocation);
        break;
      case 'waze':
        url = generateWazeUrl(result.coordinates);
        break;
      case 'apple':
        url = generateAppleMapsUrl(result.coordinates, userLocation);
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log(`🧭 Navigation ${type} ouverte pour:`, result.name);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Bouton Google Maps (disponible partout) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => openNavigation('google')}
        className="flex items-center gap-1"
        title="Ouvrir dans Google Maps"
      >
        <MapPin className="h-3 w-3" />
        <span className="hidden sm:inline">Google</span>
      </Button>

      {/* Bouton Waze (populaire sur mobile) */}
      {(isIOS || isAndroid) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openNavigation('waze')}
          className="flex items-center gap-1"
          title="Ouvrir dans Waze"
        >
          <Navigation className="h-3 w-3" />
          <span className="hidden sm:inline">Waze</span>
        </Button>
      )}

      {/* Bouton Apple Maps (iOS uniquement) */}
      {isIOS && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openNavigation('apple')}
          className="flex items-center gap-1"
          title="Ouvrir dans Plans"
        >
          <Car className="h-3 w-3" />
          <span className="hidden sm:inline">Plans</span>
        </Button>
      )}

      {/* Bouton générique pour le web */}
      {!isIOS && !isAndroid && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openNavigation('google')}
          className="flex items-center gap-1"
          title="Itinéraire"
        >
          <ExternalLink className="h-3 w-3" />
          <span className="hidden sm:inline">Itinéraire</span>
        </Button>
      )}
    </div>
  );
};

export default ExternalNavigation;
