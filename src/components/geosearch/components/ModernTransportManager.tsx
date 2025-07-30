import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Bike, 
  Footprints, 
  Bus,
  Train,
  Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernTransportManagerProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  className?: string;
}

const transportModes = [
  { id: 'walking', icon: Footprints, label: 'À pied', color: 'text-green-600' },
  { id: 'driving', icon: Car, label: 'Voiture', color: 'text-blue-600' },
  { id: 'cycling', icon: Bike, label: 'Vélo', color: 'text-orange-600' },
  { id: 'transit', icon: Bus, label: 'Transport', color: 'text-purple-600' },
  { id: 'train', icon: Train, label: 'Train', color: 'text-red-600' },
  { id: 'flight', icon: Plane, label: 'Avion', color: 'text-sky-600' }
];

const ModernTransportManager: React.FC<ModernTransportManagerProps> = ({
  selectedMode,
  onModeChange,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {transportModes.map(({ id, icon: Icon, label, color }) => (
        <Button
          key={id}
          variant={selectedMode === id ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange(id)}
          className={cn(
            "flex items-center gap-2 justify-start",
            selectedMode === id 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted"
          )}
        >
          <Icon className={cn("h-4 w-4", selectedMode !== id && color)} />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ModernTransportManager;