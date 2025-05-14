
import React from "react";
import { Button } from "@/components/ui/button";
import { TransportMode } from "@/lib/data/transportModes";

interface TransportModeItem {
  name: string;
  icon: React.ReactNode;
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
      {transportModes.map((mode) => (
        <Button
          key={mode.name}
          style={{ backgroundColor: mode.color }}
          className={`text-white rounded-xl ${selectedTransport === mode.name ? "ring-2 ring-black" : ""}`}
          onClick={() => onTransportSelect(mode.name)}
        >
          {React.isValidElement(mode.icon) ? mode.icon : null} {mode.name}
        </Button>
      ))}
    </div>
  );
};

export default TransportSelector;
