
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TransportMode } from '@/lib/data/transportModes';
import { MapPin, Filter as FilterIcon, Bike, Car, User, Bus, Train } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BadgesFiltresProps {
  transportMode: TransportMode;
  distance: number;
  distanceUnit: 'km' | 'mi';
  category?: string | null;
  subcategory?: string | null;
  query?: string | null;
  aroundMeCount?: number;
  showMultiDirections?: boolean;
  maxDuration?: number;
}

const BadgesFiltres: React.FC<BadgesFiltresProps> = ({
  transportMode,
  distance,
  distanceUnit,
  category,
  subcategory,
  query,
  aroundMeCount,
  showMultiDirections,
  maxDuration
}) => {
  const { t } = useTranslation();
  
  const getTransportModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'car': return <Car size={12} />;
      case 'walking': return <User size={12} />;
      case 'cycling': return <Bike size={12} />;
      case 'bus': return <Bus size={12} />;
      case 'train': return <Train size={12} />;
      default: return <Car size={12} />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {query && (
        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600 flex items-center gap-1">
          <MapPin size={12} />
          <span className="truncate max-w-[150px]">{query}</span>
        </Badge>
      )}
      
      {category && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.category')}: {category}
        </Badge>
      )}
      
      {subcategory && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.subcategory')}: {subcategory}
        </Badge>
      )}
      
      <Badge variant="secondary" className="text-xs flex items-center gap-1">
        {getTransportModeIcon(transportMode)}
        <span>{t(`filters.transportModes.${transportMode}`)}</span>
      </Badge>
      
      <Badge variant="secondary" className="text-xs">
        {distance} {t(`filters.units.${distanceUnit}`)}
      </Badge>
      
      {maxDuration && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.duration')}: {maxDuration} min
        </Badge>
      )}
      
      {aroundMeCount && aroundMeCount > 3 && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.aroundMe')}: {aroundMeCount} {t('filters.places').toLowerCase()}
        </Badge>
      )}
      
      {showMultiDirections && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.multiDirections')}
        </Badge>
      )}
    </div>
  );
};

export default BadgesFiltres;
