import React from 'react';
import { Car, User, Bike, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactTransportGridProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const transportModes = [
  { 
    id: 'walking', 
    icon: User, 
    label: 'Pied',
    color: 'bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30',
    activeColor: 'bg-green-500 text-white border-green-600'
  },
  { 
    id: 'driving', 
    icon: Car, 
    label: 'Auto',
    color: 'bg-blue-500/20 border-blue-500 text-blue-700 hover:bg-blue-500/30',
    activeColor: 'bg-blue-500 text-white border-blue-600'
  },
  { 
    id: 'cycling', 
    icon: Bike, 
    label: 'Vélo',
    color: 'bg-orange-500/20 border-orange-500 text-orange-700 hover:bg-orange-500/30',
    activeColor: 'bg-orange-500 text-white border-orange-600'
  },
  { 
    id: 'transit', 
    icon: Bus, 
    label: 'Bus',
    color: 'bg-purple-500/20 border-purple-500 text-purple-700 hover:bg-purple-500/30',
    activeColor: 'bg-purple-500 text-white border-purple-600'
  }
];

const CompactTransportGrid: React.FC<CompactTransportGridProps> = ({
  selectedMode,
  onModeChange,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-4 gap-1.5", className)}>
      {transportModes.map(({ id, icon: Icon, label, color, activeColor }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200",
            "min-h-[60px] text-xs",
            selectedMode === id ? activeColor : color
          )}
        >
          <Icon className="h-3.5 w-3.5 mb-1" />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default CompactTransportGrid;