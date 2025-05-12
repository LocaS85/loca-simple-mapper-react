
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapRef } from "react-map-gl";
import { categories } from "@/lib/data/categories";
import { TransportMode, transportModes } from "@/lib/data/transportModes";
import { CategoryItem } from "@/types/categories";
import { MapPin, Utensils, ShoppingBag, Home, Briefcase } from "lucide-react";

interface FilterBarProps {
  mapRef: React.RefObject<MapRef>;
  onFiltersChange: (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
  }) => void;
}

// Helper function to get the correct icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Utensils":
      return Utensils;
    case "ShoppingBag":
      return ShoppingBag;
    case "MapPin":
      return MapPin;
    case "Home":
      return Home;
    case "Briefcase":
      return Briefcase;
    default:
      return MapPin;
  }
};

export function FilterBar({ mapRef, onFiltersChange }: FilterBarProps) {
  const [category, setCategory] = useState("food");
  const [transportMode, setTransportMode] = useState<TransportMode>("car");
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxDuration, setMaxDuration] = useState(15);

  useEffect(() => {
    onFiltersChange({ category, transportMode, maxDistance, maxDuration });
  }, [category, transportMode, maxDistance, maxDuration, onFiltersChange]);

  return (
    <div className="w-full p-4 rounded-2xl shadow-lg bg-white dark:bg-neutral-900 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-auto">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: CategoryItem) => {
              const IconComponent = getIconComponent(cat.icon);
              return (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" style={{ color: cat.color }} />
                    {cat.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <ToggleGroup type="single" value={transportMode} onValueChange={(val: TransportMode) => val && setTransportMode(val)}>
        {transportModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <ToggleGroupItem key={mode.value} value={mode.value} aria-label={mode.label}>
              <Icon className="w-5 h-5" />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <div className="flex flex-col gap-1 w-full md:w-1/3">
        <label className="text-sm text-muted-foreground">Distance max (km): {maxDistance}</label>
        <Slider min={1} max={50} step={1} value={[maxDistance]} onValueChange={(val) => setMaxDistance(val[0])} />
      </div>

      <div className="flex flex-col gap-1 w-full md:w-1/3">
        <label className="text-sm text-muted-foreground">Durée max (min): {maxDuration}</label>
        <Slider min={1} max={60} step={1} value={[maxDuration]} onValueChange={(val) => setMaxDuration(val[0])} />
      </div>
    </div>
  );
}
