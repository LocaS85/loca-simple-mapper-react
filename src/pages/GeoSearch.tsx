import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Map from "react-map-gl";
import { NavigationControl, Marker } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Mic as FaMicrophone,
  Navigation as FaLocationArrow,
  Car as FaCar,
  User as FaUsers,
  Star as FaStar,
  Share2 as FaShareAlt,
  Printer as FaPrint,
  Ship as FaShip,
  Bus as FaBus,
  Bike as FaBicycle,
  Train as FaTrain,
  UserWalking as FaWalking,
} from "lucide-react";

const categories = [
  { name: "Divertissement", color: "#9f7aea", icon: <FaStar /> },
  { name: "Santé", color: "#48bb78", icon: <FaWalking /> },
  { name: "Travail", color: "#4299e1", icon: <FaCar /> },
];

const transportModes = [
  { name: "Voiture", icon: <FaCar />, color: "#f56565" },
  { name: "À pied", icon: <FaWalking />, color: "#48bb78" },
  { name: "Vélo", icon: <FaBicycle />, color: "#ed8936" },
  { name: "Train", icon: <FaTrain />, color: "#4299e1" },
  { name: "Bateau", icon: <FaShip />, color: "#38b2ac" },
  { name: "Férie", icon: <FaBus />, color: "#805ad5" },
  { name: "Co-voiturage", icon: <FaUsers />, color: "#d69e2e" },
];

export default function GeoSearchPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(3);
  const [distance, setDistance] = useState(5);
  const [transport, setTransport] = useState("À pied");
  const [mapboxToken, setMapboxToken] = useState<string>('');
  
  useEffect(() => {
    // Try to get token from localStorage or environment variable
    const savedToken = localStorage.getItem('mapbox_token') || '';
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

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
    enabled: !!mapboxToken // Only run query if we have a mapbox token
  });

  // Function to handle token input
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
    }
  };

  // If no token is available, show input form
  if (!mapboxToken) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mapbox Token Required</h2>
          <p className="text-gray-600 mb-4">
            Please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Mapbox Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                required
                placeholder="pk.eyJ1IjoieW91..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Token
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="md:w-1/3 w-full p-4 overflow-auto bg-white border-r">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher un lieu (ex: cinéma)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline">
            <FaMicrophone className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <FaLocationArrow className="h-4 w-4" />
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
        <Map
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          initialViewState={{ longitude: 2.35, latitude: 48.85, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />
          {places?.map((place) => (
            <Marker
              key={place.id}
              longitude={place.longitude}
              latitude={place.latitude}
              color={transportModes.find((t) => t.name === transport)?.color}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}
