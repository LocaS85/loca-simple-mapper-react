
import React from 'react';
import { MapToggle } from '@/components/categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";

interface CategoryPageHeaderProps {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
  aroundMeRadius?: number;
  setAroundMeRadius?: (radius: number) => void;
  showMultiDirections?: boolean;
  setShowMultiDirections?: (show: boolean) => void;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  showMap,
  setShowMap,
  maxDistance,
  setMaxDistance,
  maxDuration,
  setMaxDuration,
  aroundMeRadius = 5,
  setAroundMeRadius,
  showMultiDirections = false,
  setShowMultiDirections
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl md:text-3xl font-bold">Catégories</h1>
      <div className="flex items-center gap-4">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <Tabs 
            defaultValue="distance" 
            className="w-[250px]"
            onValueChange={(value) => console.log("Tab changed:", value)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="duration">Durée</TabsTrigger>
              <TabsTrigger value="around" className="flex items-center gap-1">
                <Compass className="h-4 w-4" />
                <span>Autour</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="distance" className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max:</span>
                <div className="flex items-center gap-2">
                  <Slider
                    className="w-32"
                    value={[maxDistance]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(values) => setMaxDistance(values[0])}
                  />
                  <span className="text-sm font-medium min-w-[40px] text-right">{maxDistance} km</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="duration" className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max:</span>
                <div className="flex items-center gap-2">
                  <Slider
                    className="w-32"
                    value={[maxDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(values) => setMaxDuration(values[0])}
                  />
                  <span className="text-sm font-medium min-w-[40px] text-right">{maxDuration} min</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="around" className="pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rayon:</span>
                  <div className="flex items-center gap-2">
                    <Slider
                      className="w-32"
                      value={[aroundMeRadius]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(values) => setAroundMeRadius && setAroundMeRadius(values[0])}
                    />
                    <span className="text-sm font-medium min-w-[40px] text-right">{aroundMeRadius} km</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="multi-directions" className="text-sm font-medium">
                    Tracés multi-directionnels
                  </Label>
                  <Switch 
                    id="multi-directions" 
                    checked={showMultiDirections}
                    onCheckedChange={(checked) => setShowMultiDirections && setShowMultiDirections(checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <MapToggle showMap={showMap} setShowMap={setShowMap} />
      </div>
    </div>
  );
};

export default CategoryPageHeader;
