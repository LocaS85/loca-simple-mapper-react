
import React from 'react';
import { MapToggle } from '@/components/categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface CategoryPageHeaderProps {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  showMap,
  setShowMap,
  maxDistance,
  setMaxDistance,
  maxDuration,
  setMaxDuration
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="duration">Durée</TabsTrigger>
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
          </Tabs>
        </div>
        <MapToggle showMap={showMap} setShowMap={setShowMap} />
      </div>
    </div>
  );
};

export default CategoryPageHeader;
