
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransportMode, transportModes } from "@/lib/data/transportModes";
import { CategoryItem } from "@/types/categories";
import { MapPin, Utensils, ShoppingBag, Home, Briefcase, Compass, Route } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterBarProps {
  mapRef: React.RefObject<any>;
  onFiltersChange: (filters: {
    category: string;
    transportMode: TransportMode;
    maxDistance: number;
    maxDuration: number;
    aroundMeCount?: number;
    showMultiDirections?: boolean;
    distanceUnit?: 'km' | 'mi';
  }) => void;
  initialCategory?: string;
  initialTransportMode?: TransportMode;
  initialMaxDistance?: number;
  initialMaxDuration?: number;
  initialAroundMeCount?: number;
  initialShowMultiDirections?: boolean;
  initialDistanceUnit?: 'km' | 'mi';
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

export function FilterBar({ 
  mapRef, 
  onFiltersChange, 
  initialCategory, 
  initialTransportMode = "car",
  initialMaxDistance = 5,
  initialMaxDuration = 15,
  initialAroundMeCount = 3,
  initialShowMultiDirections = false,
  initialDistanceUnit = 'km'
}: FilterBarProps) {
  const [category, setCategory] = useState(initialCategory || "food");
  const [transportMode, setTransportMode] = useState<TransportMode>(initialTransportMode);
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance);
  const [maxDuration, setMaxDuration] = useState(initialMaxDuration);
  const [aroundMeCount, setAroundMeCount] = useState(initialAroundMeCount);
  const [showMultiDirections, setShowMultiDirections] = useState(initialShowMultiDirections);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>(initialDistanceUnit);

  // Update category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  // Update other filters if their initial values change
  useEffect(() => {
    setTransportMode(initialTransportMode);
  }, [initialTransportMode]);

  useEffect(() => {
    setMaxDistance(initialMaxDistance);
  }, [initialMaxDistance]);

  useEffect(() => {
    setMaxDuration(initialMaxDuration);
  }, [initialMaxDuration]);
  
  useEffect(() => {
    setAroundMeCount(initialAroundMeCount);
  }, [initialAroundMeCount]);
  
  useEffect(() => {
    setShowMultiDirections(initialShowMultiDirections);
  }, [initialShowMultiDirections]);

  useEffect(() => {
    setDistanceUnit(initialDistanceUnit);
  }, [initialDistanceUnit]);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({ 
      category, 
      transportMode, 
      maxDistance, 
      maxDuration,
      aroundMeCount,
      showMultiDirections,
      distanceUnit
    });
  }, [category, transportMode, maxDistance, maxDuration, aroundMeCount, showMultiDirections, distanceUnit, onFiltersChange]);

  // Get the appropriate max value for distance slider based on unit
  const getMaxDistanceValue = () => {
    return distanceUnit === 'km' ? 50 : 30; // 50 km or 30 miles
  };

  return (
    <div className="w-full p-4 rounded-2xl shadow-lg bg-white dark:bg-neutral-900">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Catégorie */}
        <div className="w-full md:w-auto flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie
          </label>
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
        
        {/* Mode de transport */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mode de transport
          </label>
          <ToggleGroup 
            type="single" 
            value={transportMode} 
            onValueChange={(val: TransportMode) => val && setTransportMode(val)}
            className="justify-start flex-wrap"
          >
            {transportModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <ToggleGroupItem 
                  key={mode.value} 
                  value={mode.value} 
                  aria-label={mode.label}
                  className="flex-1 max-w-[80px] data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs mt-1">{mode.label}</span>
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Distance maximale */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance max
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{maxDistance} {distanceUnit}</span>
              <RadioGroup 
                value={distanceUnit} 
                onValueChange={(value: 'km' | 'mi') => setDistanceUnit(value)}
                className="flex items-center space-x-1"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="km" id="km" className="h-3 w-3" />
                  <Label htmlFor="km" className="ml-1 text-xs">km</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="mi" id="mi" className="h-3 w-3" />
                  <Label htmlFor="mi" className="ml-1 text-xs">mi</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Slider 
            min={1} 
            max={getMaxDistanceValue()} 
            step={1} 
            value={[maxDistance]} 
            onValueChange={(val) => setMaxDistance(val[0])} 
          />
        </div>

        {/* Durée maximale */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Durée max
            </label>
            <span className="text-sm font-medium">{maxDuration} min</span>
          </div>
          <Slider 
            min={1} 
            max={60} 
            step={1} 
            value={[maxDuration]} 
            onValueChange={(val) => setMaxDuration(val[0])} 
          />
        </div>
      </div>
      
      {/* Section "Autour de moi" */}
      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Autour de moi
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre de résultats à afficher */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de lieux
              </label>
              <span className="text-sm font-medium">{aroundMeCount}</span>
            </div>
            <Slider 
              min={1} 
              max={10} 
              step={1} 
              value={[aroundMeCount]} 
              onValueChange={(val) => setAroundMeCount(val[0])} 
            />
          </div>
          
          {/* Tracés multi-directionnels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-600" />
              <Label htmlFor="multi-directions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tracés multi-directionnels
              </Label>
            </div>
            <Switch 
              id="multi-directions" 
              checked={showMultiDirections}
              onCheckedChange={setShowMultiDirections}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
