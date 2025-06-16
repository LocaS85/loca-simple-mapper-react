
import React from "react";
import { MapResult } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ResultsListProps {
  results: MapResult[];
  onSelect: (result: MapResult) => void;
}

export const ResultsList = ({ results, onSelect }: ResultsListProps) => {
  return (
    <div className="w-full md:w-1/3 h-full bg-white shadow-lg border-l border-gray-200 overflow-hidden rounded-2xl">
      <ScrollArea className="h-full p-4 space-y-4">
        {results.length === 0 ? (
          <div className="text-gray-500 text-sm italic">Aucun résultat pour vos filtres</div>
        ) : (
          results.map((result, index) => (
            <Card key={index} className="hover:shadow-md transition">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-base text-gray-800">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.address}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSelect(result)}
                    title="Afficher sur la carte"
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 flex justify-between">
                  <span>Distance : {result.distance}</span>
                  <span>Durée : {result.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ResultsList;
