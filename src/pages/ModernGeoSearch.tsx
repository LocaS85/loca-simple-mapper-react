
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import MapboxMap from "@/components/MapboxMap";
import { TransportModeSelector } from "@/components/TransportModeSelector";
import "mapbox-gl/dist/mapbox-gl.css";

const categories = ["Divertissement", "Travail", "Santé"];

export default function ModernGeoSearch() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [radius, setRadius] = useState(5);
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState("walking");
  const [results, setResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.35, 48.85]); // Default to Paris
  const { toast } = useToast();

  // Get user location on component mount
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          title: "Localisation",
          description: "Impossible d'obtenir votre position, utilisation de Paris par défaut",
          variant: "destructive",
        });
      }
    );
  }, [toast]);

  const handleSearch = async () => {
    // Mocking data since we don't have actual Supabase connection
    const mockData = [
      { id: '1', name: 'Cinéma Gaumont', address: '123 Rue de Cinema, Paris', lng: 2.34, lat: 48.86, type: 'Divertissement' },
      { id: '2', name: 'Hôpital Saint-Louis', address: '1 Avenue Claude Vellefaux, Paris', lng: 2.37, lat: 48.87, type: 'Santé' },
      { id: '3', name: 'Tour Eiffel', address: 'Champ de Mars, Paris', lng: 2.29, lat: 48.86, type: 'Divertissement' },
      { id: '4', name: 'Bureau Central', address: '15 Rue de Rivoli, Paris', lng: 2.36, lat: 48.85, type: 'Travail' },
      { id: '5', name: 'Pharmacie Centrale', address: '8 Avenue des Champs-Élysées, Paris', lng: 2.31, lat: 48.87, type: 'Santé' }
    ];

    // Filter by category if selected
    let filtered = category 
      ? mockData.filter(item => item.type === category)
      : mockData;
    
    // Filter by search term
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Limit to count
    filtered = filtered.slice(0, count);

    setResults(filtered);
    
    toast({
      title: "Recherche terminée",
      description: `${filtered.length} résultats trouvés`,
      variant: "default",
    });
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="flex flex-col p-4 space-y-4 overflow-auto">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher un lieu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleLocationRequest}>
            <span className="sr-only">Localisation</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(category === cat ? null : cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">Rayon de recherche: {radius} km</label>
          <Slider min={1} max={20} value={[radius]} onValueChange={(val) => setRadius(val[0])} className="mt-1"/>
        </div>

        <div>
          <label className="text-sm font-medium">Nombre de résultats: {count}</label>
          <Slider min={1} max={10} value={[count]} onValueChange={(val) => setCount(val[0])} className="mt-1"/>
        </div>

        <TransportModeSelector mode={mode} setMode={setMode} />

        <Button onClick={handleSearch} className="mt-2">Lancer la recherche</Button>

        <div className="space-y-2 overflow-y-auto flex-grow">
          <h2 className="font-semibold text-lg">Résultats ({results.length})</h2>
          {results.length === 0 && (
            <div className="text-sm text-gray-500">Aucun résultat. Lancez une recherche.</div>
          )}
          {results.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.address}</div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">{Math.round(Math.random() * radius * 10) / 10} km</span>
                  <Button size="sm" variant="outline">
                    Itinéraire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="relative h-screen">
        <MapboxMap 
          results={results} 
          radius={radius}
          category={category || ""}
          transport={mode}
        />
      </div>
    </div>
  );
}
