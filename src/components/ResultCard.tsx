
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  id: string;
  name: string;
  type: string;
  distance: number;
  onDirections: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  id,
  name,
  type,
  distance,
  onDirections
}) => {
  return (
    <Card key={id}>
      <CardContent className="p-4">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{type}</div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">{distance} km</span>
          <Button size="sm" variant="outline" onClick={onDirections}>
            Itinéraire
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
