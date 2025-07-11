import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Heart, Share2, Phone, ExternalLink } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { 
  openGoogleMaps, 
  openWaze, 
  openAppleMaps, 
  getAvailableNavigationApps,
  NavigationDestination 
} from '@/utils/externalNavigation';

interface LocationDetailsPopupProps {
  location: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (coordinates: [number, number]) => void;
  onAddFavorite?: (location: SearchResult) => void;
}

const LocationDetailsPopup: React.FC<LocationDetailsPopupProps> = ({
  location,
  isOpen,
  onClose,
  onNavigate,
  onAddFavorite
}) => {
  if (!location) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: location.name,
          text: `Découvrez ${location.name}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      navigator.clipboard.writeText(`${location.name} - ${location.address}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            {location.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-3">
            {location.address && (
              <p className="text-gray-600 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                {location.address}
              </p>
            )}
            
            {location.category && (
              <Badge variant="secondary" className="text-sm">
                {location.category}
              </Badge>
            )}

            {location.distance && (
              <div className="text-sm text-gray-500">
                📏 À {location.distance.toFixed(1)} km
                {location.duration && (
                  <span className="ml-2">
                    ⏱️ {Math.round(typeof location.duration === 'number' ? location.duration : parseFloat(location.duration.toString()) || 0)} min
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions principales */}
          <div className="space-y-3">
            {/* Navigation rapide */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  const destination: NavigationDestination = {
                    lat: location.coordinates[1],
                    lng: location.coordinates[0],
                    name: location.name,
                    address: location.address
                  };
                  openGoogleMaps(destination);
                }}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Google Maps
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const destination: NavigationDestination = {
                    lat: location.coordinates[1],
                    lng: location.coordinates[0],
                    name: location.name,
                    address: location.address
                  };
                  openWaze(destination);
                }}
                className="flex items-center gap-2"
              >
                🚗 Waze
              </Button>
            </div>

            {/* Actions secondaires */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const destination: NavigationDestination = {
                    lat: location.coordinates[1],
                    lng: location.coordinates[0],
                    name: location.name,
                    address: location.address
                  };
                  openAppleMaps(destination);
                }}
                className="flex items-center gap-2"
              >
                🧭 Plans
              </Button>

              {onAddFavorite && (
                <Button
                  variant="outline"
                  onClick={() => onAddFavorite(location)}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Favoris
                </Button>
              )}
            </div>
          </div>

          {/* Actions secondaires */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex-1 flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`tel:${location.name}`, '_blank')}
              className="flex-1 flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Appeler
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(
                `https://www.google.com/search?q=${encodeURIComponent(location.name + ' ' + location.address)}`,
                '_blank'
              )}
              className="flex-1 flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Plus d'infos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailsPopup;