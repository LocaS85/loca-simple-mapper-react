import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  Navigation,
  Car,
  User,
  Star,
  Share2,
  Printer,
  Ship,
  Bus,
  Bike,
  Train,
  User as UserIcon,
} from "lucide-react";

const categories = [
  { name: "Divertissement", color: "#9f7aea", icon: <Star /> },
  { name: "Santé", color: "#48bb78", icon: <UserIcon /> },
  { name: "Travail", color: "#4299e1", icon: <Car /> },
];

const transportModes = [
  { name: "Voiture", icon: <Car />, color: "#f56565" },
  { name: "À pied", icon: <UserIcon />, color: "#48bb78" },
  { name: "Vélo", icon: <Bike />, color: "#ed8936" },
  { name: "Train", icon: <Train />, color: "#4299e1" },
  { name: "Bateau", icon: <Ship />, color: "#38b2ac" },
  { name: "Férie", icon: <Bus />, color: "#805ad5" },
  { name: "Co-voiturage", icon: <User />, color: "#d69e2e" },
];

export default function GeoSearchPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(3);
  const [distance, setDistance] = useState(5);
  const [transport, setTransport] = useState("À pied");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  
  // Définir le token Mapbox directement
  const mapboxToken = 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg';

  const { data: places = [] } = useQuery({
    queryKey: ["places", search, category, resultsCount, distance, transport],
    queryFn: async () => {
      // Since we haven't created the places table yet, return mock data
      return [
        { id: '1', name: 'Cinéma Gaumont', longitude: 2.34, latitude: 48.86, type: 'Divertissement' },
        { id: '2', name: 'Hôpital Saint-Louis', longitude: 2.37, latitude: 48.87, type: 'Santé' },
        { id: '3', name: 'Tour Eiffel', longitude: 2.29, latitude: 48.86, type: 'Divertissement' }
      ];
    },
    enabled: true // Always run the query since we now have a mapbox token
  });

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.35, 48.85], // Paris coordinates
        zoom: 12
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when results change
  useEffect(() => {
    if (!map.current || !places.length) return;
    
    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());
    
    // Add new markers
    places.forEach(place => {
      const color = transportModes.find(m => m.name === transport)?.color || "#f56565";
      
      new mapboxgl.Marker({ color })
        .setLngLat([place.longitude, place.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3 class="font-medium">${place.name}</h3><p>${place.type}</p>`)
        )
        .addTo(map.current!);
    });
  }, [places, transport]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="md:w-1/3 w-full p-4 overflow-auto bg-white border-r">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher un lieu (ex: cinéma)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline">
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-lg mt-4 font-semibold">Catégories</h2>
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

          <h2 className="text-lg mt-4 font-semibold">Nombre de résultats</h2>
          <div className="flex items-center gap-4">
            <Slider
              className="flex-1"
              min={1}
              max={10}
              defaultValue={[resultsCount]}
              onValueChange={(val) => setResultsCount(val[0])}
            />
            <span className="font-medium">{resultsCount}</span>
          </div>

          <h2 className="text-lg mt-4 font-semibold">Distance (km)</h2>
          <div className="flex items-center gap-4">
            <Slider
              className="flex-1"
              min={1}
              max={50}
              defaultValue={[distance]}
              onValueChange={(val) => setDistance(val[0])}
            />
            <span className="font-medium">{distance} km</span>
          </div>

          <h2 className="text-lg mt-4 font-semibold">Mode de transport</h2>
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

          {/* Results */}
          <h2 className="text-lg mt-6 font-semibold">Résultats ({places.length})</h2>
          <div className="space-y-3 mt-2">
            {places.map((place) => (
              <Card key={place.id}>
                <CardContent className="p-4">
                  <div className="font-medium">{place.name}</div>
                  <div className="text-sm text-gray-500">{place.type}</div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">{distance} km</span>
                    <Button size="sm" variant="outline">Itinéraire</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
