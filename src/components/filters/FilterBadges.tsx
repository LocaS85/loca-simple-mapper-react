
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TransportMode } from '@/lib/data/transportModes';
import { MapPin, Filter as FilterIcon, Bike, Car, User, Bus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FilterBadgesProps {
  transportMode: TransportMode;
  distance: number;
  distanceUnit: 'km' | 'mi';
  category?: string | null;
  subcategory?: string | null;
  query?: string | null;
  aroundMeCount?: number;
  showMultiDirections?: boolean;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({
  transportMode,
  distance,
  distanceUnit,
  category,
  subcategory,
  query,
  aroundMeCount,
  showMultiDirections
}) => {
  const { t } = useTranslation();
  
  const getTransportModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'car': return <Car size={12} />;
      case 'walking': return <User size={12} />;
      case 'cycling': return <Bike size={12} />;
      case 'bus': return <Bus size={12} />;
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
          {t('common.category')}: {category}
        </Badge>
      )}
      
      {subcategory && (
        <Badge variant="secondary" className="text-xs">
          {subcategory}
        </Badge>
      )}
      
      <Badge variant="secondary" className="text-xs flex items-center gap-1">
        {getTransportModeIcon(transportMode)}
        <span>{t(`filters.transportModes.${transportMode}`)}</span>
      </Badge>
      
      <Badge variant="secondary" className="text-xs">
        {distance} {distanceUnit}
      </Badge>
      
      {aroundMeCount && aroundMeCount > 3 && (
        <Badge variant="secondary" className="text-xs">
          {t('filters.aroundMe')}: {aroundMeCount}
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

export default FilterBadges;
