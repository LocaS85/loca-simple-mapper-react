import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/types/unified';
import { MapboxDirectionsService } from '@/services/mapbox/directions';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation, X } from 'lucide-react';

interface NativeDirectionsControlProps {
  map: mapboxgl.Map | null;
  transportMode?: TransportMode;
  onRouteCalculated?: (route: {
    distance: number;
    duration: number;
    geometry: any;
  }) => void;
}

const transportModeToProfile = (mode: TransportMode): string => {
  switch (mode) {
    case 'car': return 'driving';
    case 'walking': return 'walking';
    case 'cycling': return 'cycling';
    case 'bus':
    case 'transit': return 'driving';
    default: return 'driving';
  }
};

export const NativeDirectionsControl: React.FC<NativeDirectionsControlProps> = ({
  map,
  transportMode = 'car',
  onRouteCalculated
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentTransport, setCurrentTransport] = useState<TransportMode>(transportMode);
  const [isCalculating, setIsCalculating] = useState(false);
  const directionsService = useRef(new MapboxDirectionsService());
  const routeSourceId = useRef('directions-route');

  const clearRoute = () => {
    if (!map) return;
    
    try {
      if (map.getSource(routeSourceId.current)) {
        map.removeLayer(`${routeSourceId.current}-line`);
        map.removeSource(routeSourceId.current);
      }
    } catch (error) {
      console.warn('Erreur lors du nettoyage de l\'itinéraire:', error);
    }
  };

  const calculateRoute = async () => {
    if (!map || !origin || !destination) return;

    setIsCalculating(true);
    clearRoute();

    try {
      // Géocoder l'origine et la destination
      const geocodeOrigin = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${directionsService.current['token']}&limit=1`);
      const geocodeDestination = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${directionsService.current['token']}&limit=1`);
      
      const originData = await geocodeOrigin.json();
      const destinationData = await geocodeDestination.json();

      if (!originData.features?.length || !destinationData.features?.length) {
        throw new Error('Adresses non trouvées');
      }

      const originCoords: [number, number] = originData.features[0].center;
      const destinationCoords: [number, number] = destinationData.features[0].center;

      // Calculer l'itinéraire
      const route = await directionsService.current.getDirections(
        originCoords,
        destinationCoords,
        currentTransport
      );

      // Ajouter l'itinéraire à la carte
      map.addSource(routeSourceId.current, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });

      map.addLayer({
        id: `${routeSourceId.current}-line`,
        type: 'line',
        source: routeSourceId.current,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Ajuster la vue pour montrer l'itinéraire
      const coordinates = route.geometry.coordinates;
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });

      // Callback avec les informations de l'itinéraire
      if (onRouteCalculated) {
        onRouteCalculated(route);
      }

    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    setCurrentTransport(transportMode);
  }, [transportMode]);

  if (!isVisible) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => setIsVisible(true)}
          variant="secondary"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {t('map.directions', 'Itinéraires')}
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur-sm border rounded-lg p-4 w-80 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t('map.directions', 'Itinéraires')}</h3>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <Input
          placeholder={t('map.startPoint', 'Point de départ')}
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        
        <Input
          placeholder={t('map.destination', 'Destination')}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <Select value={currentTransport} onValueChange={(value: TransportMode) => setCurrentTransport(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">🚗 Voiture</SelectItem>
            <SelectItem value="walking">🚶 À pied</SelectItem>
            <SelectItem value="cycling">🚴 Vélo</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            onClick={calculateRoute}
            disabled={!origin || !destination || isCalculating}
            className="flex-1"
          >
            {isCalculating ? 'Calcul...' : 'Calculer'}
          </Button>
          
          <Button
            onClick={clearRoute}
            variant="outline"
          >
            Effacer
          </Button>
        </div>
      </div>
    </div>
  );
};