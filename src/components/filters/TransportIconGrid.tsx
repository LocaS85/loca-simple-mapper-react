import React from 'react';
import { Car, User, Bike, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransportIconGridProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const transportModes = [
  { 
    id: 'walking', 
    icon: User, 
    color: 'bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30',
    activeColor: 'bg-green-500 text-white border-green-600'
  },
  { 
    id: 'driving', 
    icon: Car, 
    color: 'bg-blue-500/20 border-blue-500 text-blue-700 hover:bg-blue-500/30',
    activeColor: 'bg-blue-500 text-white border-blue-600'
  },
  { 
    id: 'cycling', 
    icon: Bike, 
    color: 'bg-orange-500/20 border-orange-500 text-orange-700 hover:bg-orange-500/30',
    activeColor: 'bg-orange-500 text-white border-orange-600'
  },
  { 
    id: 'transit', 
    icon: Bus, 
    color: 'bg-purple-500/20 border-purple-500 text-purple-700 hover:bg-purple-500/30',
    activeColor: 'bg-purple-500 text-white border-purple-600'
  }
];

const TransportIconGrid: React.FC<TransportIconGridProps> = ({
  selectedMode,
  onModeChange,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {transportModes.map(({ id, icon: Icon, color, activeColor }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={cn(
            "aspect-square rounded-lg border-2 flex items-center justify-center transition-all duration-200",
            selectedMode === id ? activeColor : color
          )}
        >
          <Icon className="h-6 w-6" />
        </button>
      ))}
    </div>
  );
};

export default TransportIconGrid;