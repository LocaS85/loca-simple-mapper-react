
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Mic, Navigation } from "lucide-react";

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  resultsCount: number;
  setResultsCount: (value: number) => void;
  distance: number;
  setDistance: (value: number) => void;
  transport: string;
  setTransport: (value: string) => void;
  onSearch: () => void;
  onLocationRequest: () => void;
}

interface Category {
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface TransportMode {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  { name: "Divertissement", color: "#9f7aea", icon: <span>🎭</span> },
  { name: "Santé", color: "#48bb78", icon: <span>⚕️</span> },
  { name: "Travail", color: "#4299e1", icon: <span>💼</span> },
];

const transportModes: TransportMode[] = [
  { name: "Voiture", icon: <span>🚗</span>, color: "#f56565" },
  { name: "À pied", icon: <span>🚶</span>, color: "#48bb78" },
  { name: "Vélo", icon: <span>🚴</span>, color: "#ed8936" },
  { name: "Train", icon: <span>🚆</span>, color: "#4299e1" },
  { name: "Bateau", icon: <span>🚢</span>, color: "#38b2ac" },
  { name: "Bus", icon: <span>🚌</span>, color: "#805ad5" },
  { name: "Co-voiturage", icon: <span>👥</span>, color: "#d69e2e" },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  resultsCount,
  setResultsCount,
  distance,
  setDistance,
  transport,
  setTransport,
  onSearch,
  onLocationRequest
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Rechercher un lieu (ex: cinéma)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button variant="outline" onClick={() => {}}>
          <Mic className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onLocationRequest}>
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-lg font-semibold">Catégories</h2>
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.name}
            onClick={() => setCategory(cat.name === category ? null : cat.name)}
            style={{ backgroundColor: category === cat.name ? cat.color : undefined }}
            variant={category === cat.name ? "default" : "outline"}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Nombre de résultats</h2>
      <div className="flex items-center gap-4">
        <Slider
          className="flex-1"
          min={1}
          max={10}
          value={[resultsCount]}
          onValueChange={(val) => setResultsCount(val[0])}
        />
        <span className="font-medium">{resultsCount}</span>
      </div>

      <h2 className="text-lg font-semibold">Distance (km)</h2>
      <div className="flex items-center gap-4">
        <Slider
          className="flex-1"
          min={1}
          max={50}
          value={[distance]}
          onValueChange={(val) => setDistance(val[0])}
        />
        <span className="font-medium">{distance} km</span>
      </div>

      <h2 className="text-lg font-semibold">Mode de transport</h2>
      <div className="grid grid-cols-4 gap-2">
        {transportModes.map((mode) => (
          <Button
            key={mode.name}
            onClick={() => setTransport(mode.name)}
            variant={transport === mode.name ? "default" : "outline"}
            style={{ 
              backgroundColor: transport === mode.name ? mode.color : undefined,
              color: transport === mode.name ? "white" : undefined
            }}
            className="flex flex-col items-center p-2"
          >
            {mode.icon}
            <span className="text-xs mt-1">{mode.name.split(' ')[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
