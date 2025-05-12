
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Mic,
  Navigation,
  Car,
  MapPin,
  Bike,
  Train,
  Ship,
  Bus,
  Users,
  Star,
  Share2,
  Printer
} from "lucide-react";

// Define mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTl0eDUyZzYwM3hkMnhzOWE1azJ0M2YxIn0.c1joJPr_MouD1s4CW2ZMlg";

const categories = [
  { name: "Divertissement", color: "#9f7aea", icon: <Star className="h-4 w-4" /> },
  { name: "Santé", color: "#48bb78", icon: <MapPin className="h-4 w-4" /> },
  { name: "Travail", color: "#4299e1", icon: <Car className="h-4 w-4" /> },
];

const transportModes = [
  { name: "Voiture", icon: <Car className="h-4 w-4" />, color: "#f56565" },
  { name: "À pied", icon: <MapPin className="h-4 w-4" />, color: "#48bb78" },
  { name: "Vélo", icon: <Bike className="h-4 w-4" />, color: "#ed8936" },
  { name: "Train", icon: <Train className="h-4 w-4" />, color: "#4299e1" },
  { name: "Bateau", icon: <Ship className="h-4 w-4" />, color: "#38b2ac" },
  { name: "Bus", icon: <Bus className="h-4 w-4" />, color: "#805ad5" },
  { name: "Co-voiturage", icon: <Users className="h-4 w-4" />, color: "#d69e2e" },
];

export default function ModernGeoSearch() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(3);
  const [distance, setDistance] = useState(5);
  const [transport, setTransport] = useState("À pied");
  const [userLocation, setUserLocation] = useState<[number, number]>([2.35, 48.85]);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

  const mockPlaces = [
    {
      id: "1",
      name: "Cinéma Gaumont",
      address: "123 Rue de Cinema, Paris",
      longitude: 2.34,
      latitude: 48.86,
      type: "Divertissement",
      coordinates: [2.34, 48.86] as [number, number]
    },
    {
      id: "2",
      name: "Hôpital Saint-Louis",
      address: "1 Avenue Claude Vellefaux, Paris",
      longitude: 2.37,
      latitude: 48.87,
      type: "Santé",
      coordinates: [2.37, 48.87] as [number, number]
    },
    {
      id: "3",
      name: "Tour Eiffel",
      address: "Champ de Mars, Paris",
      longitude: 2.29,
      latitude: 48.86,
      type: "Divertissement",
      coordinates: [2.29, 48.86] as [number, number]
    }
  ];

  const places = mockPlaces.filter(place => 
    !category || place.type.includes(category)
  ).slice(0, resultsCount);

  useEffect(() => {
    if (!mapInstance) return;
    
    // Add markers for places
    places.forEach(place => {
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = `
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
          <div class="h-6 w-6 rounded-full ${
            place.type === "Divertissement" ? "bg-purple-500" : 
            place.type === "Santé" ? "bg-green-500" : "bg-blue-500"
          } flex items-center justify-center text-white text-xs font-bold">
            ${place.type === "Divertissement" ? "🎭" : place.type === "Santé" ? "⚕️" : "💼"}
          </div>
        </div>
      `;

      new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-medium">${place.name}</h3><p class="text-xs text-gray-500">${place.address}</p>`
          )
        )
        .addTo(mapInstance);
    });

    // Add user location marker
    const userEl = document.createElement("div");
    userEl.className = "user-marker";
    userEl.innerHTML = `
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg border-2 border-white">
        <div class="h-6 w-6 rounded-full bg-white flex items-center justify-center text-blue-500 text-xs font-bold">
          📍
        </div>
      </div>
    `;

    new mapboxgl.Marker(userEl)
      .setLngLat(userLocation)
      .addTo(mapInstance);

    // Fit bounds to include all markers and user location
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userLocation);
    places.forEach(place => bounds.extend(place.coordinates));
    
    mapInstance.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });

    return () => {
      // Clean up markers if needed
    };
  }, [places, mapInstance, userLocation]);

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

  const handleMapLoad = (event: any) => {
    setMapInstance(event.target);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Sidebar with filters */}
      <div className="md:w-1/3 w-full p-4 overflow-auto bg-white border-r">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher un lieu (ex: cinéma)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleLocationRequest}>
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-lg mt-4 font-semibold">Catégories</h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              onClick={() => setCategory(category === cat.name ? null : cat.name)}
              style={{ backgroundColor: category === cat.name ? cat.color : undefined }}
              variant={category === cat.name ? "default" : "outline"}
              className="flex items-center gap-2"
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
            value={[resultsCount]}
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
            value={[distance]}
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

        {/* Results list */}
        <h2 className="text-lg mt-6 font-semibold">Résultats ({places.length})</h2>
        <div className="space-y-3 mt-2">
          {places.map((place) => (
            <Card key={place.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="font-medium">{place.name}</div>
                <div className="text-sm text-gray-500">{place.address}</div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">{distance} km</span>
                  <Button size="sm" variant="outline">
                    Itinéraire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 z-10">
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: userLocation[0],
              latitude: userLocation[1],
              zoom: 13
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onLoad={handleMapLoad}
          />
        </div>
      </div>
    </div>
  );
}
