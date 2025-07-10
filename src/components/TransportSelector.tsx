
import React, { isValidElement, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { TransportModeItem } from "@/types/unified";

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
        const icon = mode.icon;
        
        return (
          <Button
            key={mode.name}
            style={{ backgroundColor: mode.color }}
            className={`text-white rounded-xl ${selectedTransport === mode.name ? "ring-2 ring-black" : ""}`}
            onClick={() => onTransportSelect(mode.name)}
          >
            {typeof icon === "function"
              ? React.createElement(icon as ComponentType<any>, {
                  className: "h-4 w-4 mr-1",
                })
              : isValidElement(icon)
              ? icon // un élément JSX valide
              : icon // string ou autre valeur
            }
            {mode.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TransportSelector;
