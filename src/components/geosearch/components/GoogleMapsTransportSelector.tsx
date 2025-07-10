import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';
import { TRANSPORT_COLORS } from './GoogleMapsMap';

interface GoogleMapsTransportSelectorProps {
  value: string;
  onChange: (transport: string) => void;
}

const transportModes = [
  { id: 'car', label: 'Voiture', icon: Car, color: TRANSPORT_COLORS.car },
  { id: 'walking', label: 'À pied', icon: PersonStanding, color: TRANSPORT_COLORS.walking },
  { id: 'cycling', label: 'Vélo', icon: Bike, color: TRANSPORT_COLORS.cycling },
  { id: 'bus', label: 'Transport', icon: Bus, color: TRANSPORT_COLORS.bus }
];

const GoogleMapsTransportSelector: React.FC<GoogleMapsTransportSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {transportModes.map((mode) => {
        const IconComponent = mode.icon;
        const isSelected = value === mode.id;
        
        return (
          <Button
            key={mode.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(mode.id)}
            className={`
              flex items-center justify-center gap-2 h-12 p-3
              ${isSelected 
                ? 'text-white' 
                : 'text-gray-700 hover:bg-gray-50'
              }
              transition-all duration-200
            `}
            style={isSelected ? { 
              backgroundColor: mode.color,
              borderColor: mode.color
            } : {}}
          >
            <IconComponent 
              className="h-4 w-4" 
              style={isSelected ? {} : { color: mode.color }}
            />
            <span className="text-xs font-medium">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default GoogleMapsTransportSelector;