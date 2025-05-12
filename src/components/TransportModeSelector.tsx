
import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Walking, Bike, Train, Boat, Bus, Users } from "lucide-react";

interface TransportModeSelectorProps {
  mode: string;
  setMode: (mode: string) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({ mode, setMode }) => {
  const transportModes = [
    { id: "driving", name: "Voiture", icon: <Car className="h-4 w-4" />, color: "#f56565" },
    { id: "walking", name: "À pied", icon: <Walking className="h-4 w-4" />, color: "#48bb78" },
    { id: "cycling", name: "Vélo", icon: <Bike className="h-4 w-4" />, color: "#ed8936" },
    { id: "transit", name: "Train", icon: <Train className="h-4 w-4" />, color: "#4299e1" },
    { id: "boat", name: "Bateau", icon: <Boat className="h-4 w-4" />, color: "#38b2ac" },
    { id: "bus", name: "Bus", icon: <Bus className="h-4 w-4" />, color: "#805ad5" },
    { id: "carpool", name: "Co-voiturage", icon: <Users className="h-4 w-4" />, color: "#d69e2e" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Mode de transport</label>
      <div className="grid grid-cols-4 gap-2">
        {transportModes.map((transportMode) => (
          <Button
            key={transportMode.id}
            variant={mode === transportMode.id ? "default" : "outline"}
            style={{ 
              backgroundColor: mode === transportMode.id ? transportMode.color : undefined,
              color: mode === transportMode.id ? "white" : undefined
            }}
            onClick={() => setMode(transportMode.id)}
            className="flex flex-col items-center p-2 h-auto"
          >
            {transportMode.icon}
            <span className="text-xs mt-1">{transportMode.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
