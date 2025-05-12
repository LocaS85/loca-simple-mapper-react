
import React from "react";
import { Button } from "@/components/ui/button";

interface TransportMode {
  name: string;
  icon: string;
  color: string;
}

interface TransportSelectorProps {
  transportModes: TransportMode[];
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
          {mode.icon} {mode.name}
        </Button>
      ))}
    </div>
  );
};

export default TransportSelector;
