
import { Car, User, Bike, Bus, Train } from "lucide-react";

export type TransportMode = "driving" | "walking" | "cycling" | "bus" | "train" | "transit";

export const transportModes = [
  { value: "driving" as TransportMode, label: "Voiture", icon: Car },
  { value: "walking" as TransportMode, label: "À pied", icon: User },
  { value: "cycling" as TransportMode, label: "Vélo", icon: Bike },
  { value: "bus" as TransportMode, label: "Bus", icon: Bus },
  { value: "train" as TransportMode, label: "Train", icon: Train },
  { value: "transit" as TransportMode, label: "Transport public", icon: Bus },
];
