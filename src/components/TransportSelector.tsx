
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
        // Check if icon is a component function
        const isIconComponent = mode.icon && typeof mode.icon === 'function';
        
        return (
          <Button
            key={mode.name}
            style={{ backgroundColor: mode.color }}
            className={`text-white rounded-xl ${selectedTransport === mode.name ? "ring-2 ring-black" : ""}`}
            onClick={() => onTransportSelect(mode.name)}
          >
            {isIconComponent ? (
              // Correctly render component icons
              React.createElement(mode.icon as React.ComponentType<any>, { className: "h-4 w-4 mr-1" })
            ) : (
              // Render as React node if not a component
              mode.icon || null
            )}
            {mode.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TransportSelector;
