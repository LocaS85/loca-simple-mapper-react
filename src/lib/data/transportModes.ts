
import { Car, Walking, Bike, Bus, Train } from "lucide-react";

export type TransportMode = "car" | "walking" | "cycling" | "bus" | "train";

export const transportModes = [
  { value: "car" as TransportMode, label: "Voiture", icon: Car },
  { value: "walking" as TransportMode, label: "À pied", icon: Walking },
  { value: "cycling" as TransportMode, label: "Vélo", icon: Bike },
  { value: "bus" as TransportMode, label: "Bus", icon: Bus },
  { value: "train" as TransportMode, label: "Train", icon: Train },
];
