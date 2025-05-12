
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SearchFilters from "@/components/SearchFilters";
import ResultCard from "@/components/ResultCard";
import MapComponent from "@/components/MapComponent";

export default function GeoSearchPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(3);
  const [distance, setDistance] = useState(5);
  const [transport, setTransport] = useState("À pied");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  
  // Fetch user's location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting location", error);
        // Default to Paris
        setUserLocation([2.35, 48.85]);
        toast({
          title: "Localisation",
          description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
          variant: "destructive",
        });
      }
    );
  }, [toast]);

  const handleLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
        toast({
          title: "Localisation",
          description: "Votre position a été mise à jour",
          variant: "default",
        });
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          title: "Erreur de localisation",
          description: "Impossible d'obtenir votre position",
          variant: "destructive",
        });
      }
    );
  };

  const { data: places = [], refetch } = useQuery({
    queryKey: ["places", search, category, resultsCount, distance, transport],
    queryFn: async () => {
      // Fixed mock data to include the required 'address' property
      return [
        { id: '1', name: 'Cinéma Gaumont', address: '123 Rue de Cinema, Paris', longitude: 2.34, latitude: 48.86, type: 'Divertissement', coordinates: [2.34, 48.86] as [number, number] },
        { id: '2', name: 'Hôpital Saint-Louis', address: '1 Avenue Claude Vellefaux, Paris', longitude: 2.37, latitude: 48.87, type: 'Santé', coordinates: [2.37, 48.87] as [number, number] },
        { id: '3', name: 'Tour Eiffel', address: 'Champ de Mars, Paris', longitude: 2.29, latitude: 48.86, type: 'Divertissement', coordinates: [2.29, 48.86] as [number, number] }
      ];
    },
    enabled: true
  });

  const handleSearch = () => {
    refetch();
  };

  const getDirections = (placeId: string) => {
    // Implement directions functionality later
    toast({
      title: "Itinéraire",
      description: `Calcul de l'itinéraire vers ${places.find(p => p.id === placeId)?.name}`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="md:w-1/3 w-full p-4 overflow-auto bg-white border-r">
          <SearchFilters 
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            resultsCount={resultsCount}
            setResultsCount={setResultsCount}
            distance={distance}
            setDistance={setDistance}
            transport={transport}
            setTransport={setTransport}
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
          />

          {/* Results */}
          <h2 className="text-lg mt-6 font-semibold">Résultats ({places.length})</h2>
          <div className="space-y-3 mt-2">
            {places.map((place) => (
              <ResultCard 
                key={place.id}
                id={place.id}
                name={place.name}
                type={place.type}
                distance={distance}
                onDirections={() => getDirections(place.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <MapComponent 
            center={userLocation}
            results={places}
            transportMode={transport === "Voiture" ? "driving" : 
                          transport === "À pied" ? "walking" : 
                          transport === "Vélo" ? "cycling" : "transit"}
            radius={distance}
            unit="km"
          />
        </div>
      </div>
    </div>
  );
}
