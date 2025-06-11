import React, { useState, useCallback } from 'react';
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
import { useTranslation } from "react-i18next";
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface FilterBarProps {
  mapRef?: React.RefObject<any>;
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
  className?: string;
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

const FilterBar: React.FC<FilterBarProps> = ({
  mapRef, 
  onFiltersChange, 
  initialCategory, 
  initialTransportMode = "walking",
  initialMaxDistance = 10,
  initialMaxDuration = 20,
  initialAroundMeCount = 3,
  initialShowMultiDirections = false,
  initialDistanceUnit = 'km',
  className = ""
}: FilterBarProps) => {
  // Use GeoSearch store for better integration
  const { filters, updateFilters } = useGeoSearchStore();
  
  const [category, setCategory] = useState(initialCategory || filters.category || "");
  const [transportMode, setTransportMode] = useState<TransportMode>(initialTransportMode || filters.transport);
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance || filters.distance);
  const [maxDuration, setMaxDuration] = useState(initialMaxDuration || filters.maxDuration);
  const [aroundMeCount, setAroundMeCount] = useState(initialAroundMeCount || filters.aroundMeCount);
  const [showMultiDirections, setShowMultiDirections] = useState(initialShowMultiDirections || filters.showMultiDirections);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>(initialDistanceUnit || filters.unit);
  const { t } = useTranslation();

  // Sync with store when filters change
  useEffect(() => {
    setCategory(filters.category || "");
    setTransportMode(filters.transport);
    setMaxDistance(filters.distance);
    setMaxDuration(filters.maxDuration);
    setAroundMeCount(filters.aroundMeCount);
    setShowMultiDirections(filters.showMultiDirections);
    setDistanceUnit(filters.unit);
  }, [filters]);

  // Update store and notify parent when filters change
  useEffect(() => {
    const newFilters = { 
      category, 
      transportMode, 
      maxDistance, 
      maxDuration,
      aroundMeCount,
      showMultiDirections,
      distanceUnit
    };
    
    onFiltersChange(newFilters);
    
    // Update store
    updateFilters({
      category: category || null,
      transport: transportMode,
      distance: maxDistance,
      maxDuration,
      aroundMeCount,
      showMultiDirections,
      unit: distanceUnit
    });
  }, [category, transportMode, maxDistance, maxDuration, aroundMeCount, showMultiDirections, distanceUnit, onFiltersChange, updateFilters]);

  // Get the appropriate max value for distance slider based on unit
  const getMaxDistanceValue = () => {
    return distanceUnit === 'km' ? 50 : 30; // 50 km or 30 miles
  };

  return (
    <div className={`w-full p-4 rounded-2xl shadow-lg bg-white dark:bg-neutral-900 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Catégorie */}
        <div className="w-full md:w-auto flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("filters.category")}
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t("filters.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes catégories</SelectItem>
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
            {t("filters.transportMode")}
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
                  aria-label={t(`filters.transportModes.${mode.value}`)}
                  className="flex-1 max-w-[80px] data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs mt-1">{t(`filters.transportModes.${mode.value}`)}</span>
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
              {t("filters.labels.maxDistance")}
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
              {t("filters.labels.maxDuration")}
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
            {t("filters.aroundMe")}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre de résultats à afficher */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("filters.places")}
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
                {t("filters.multiDirections")}
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
};

export default FilterBar;
