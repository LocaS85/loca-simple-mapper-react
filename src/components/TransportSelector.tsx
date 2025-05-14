
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface TransportModeItem {
  name: string;
  icon: React.ReactNode | React.ComponentType<any>;
  color: string;
}

interface TransportSelectorProps {
  transportModes: TransportModeItem[];
  selectedTransport: string;
  onTransportSelect: (transport: string) => void;
}

const TransportSelector: React.FC<TransportSelectorProps> = ({
  transportModes,
  selectedTransport,
  onTransportSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {transportModes.map((mode) => {
        const Icon = typeof mode.icon === 'function' ? mode.icon : null;
        
        return (
          <Button
            key={mode.name}
            style={{ backgroundColor: mode.color }}
            className={`text-white rounded-xl ${selectedTransport === mode.name ? "ring-2 ring-black" : ""}`}
            onClick={() => onTransportSelect(mode.name)}
          >
            {Icon ? <Icon className="h-4 w-4 mr-1" /> : mode.icon} {mode.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TransportSelector;
