import React from 'react';
import { Car, PersonStanding, Bike, Bus, Plane } from 'lucide-react';

interface TransportIconProps {
  mode: string;
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const transportIcons = {
  car: Car,
  walking: PersonStanding,
  cycling: Bike,
  bike: Bike,
  bus: Bus,
  transit: Bus,
  plane: Plane,
  flight: Plane
};

const TransportIcon: React.FC<TransportIconProps> = ({
  mode,
  className = '',
  color,
  size = 'md'
}) => {
  const IconComponent = transportIcons[mode.toLowerCase() as keyof typeof transportIcons] || PersonStanding;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${className}`}
      style={color ? { color } : {}}
    />
  );
};

export default TransportIcon;