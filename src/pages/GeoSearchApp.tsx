
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mic, Search, Heart, Printer, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import MapboxMap from "@/components/MapboxMap";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { name: "Divertissement", color: "#8e44ad", icon: "🎬", sub: ["Cinéma", "Concert", "Théâtre"] },
  { name: "Santé", color: "#27ae60", icon: "🧘", sub: ["Pharmacie", "Clinique", "Yoga"] },
  { name: "Alimentation", color: "#e67e22", icon: "🍔", sub: ["Café", "Restaurant", "Bar"] },
];

const transportModes = [
  { name: "Voiture", icon: "🚗", color: "#2980b9" },
  { name: "À pied", icon: "🚶", color: "#2ecc71" },
  { name: "Vélo", icon: "🚴", color: "#e67e22" },
  { name: "Train", icon: "🚆", color: "#9b59b6" },
  { name: "Bateau", icon: "⛵", color: "#16a085" },
];

interface Result {
  id: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  type: string;
}

export default function GeoSearchApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [transport, setTransport] = useState("Voiture");
  const [rangeKm, setRangeKm] = useState(5);
  const [resultCount, setResultCount] = useState(3);
  const { toast } = useToast();

  const handleCategoryClick = (cat: any) => {
    setSelectedCategory(cat);
    setSelectedSubcategories(cat.sub);
  };

  const handleSearch = () => {
    // Mocking data since we don't have actual Supabase connection
    const mockData: Result[] = [
      { id: '1', name: 'Cinéma Gaumont', address: '123 Rue de Cinema, Paris', lng: 2.34, lat: 48.86, type: 'Divertissement' },
      { id: '2', name: 'Centre médical', address: '1 Avenue Claude Vellefaux, Paris', lng: 2.37, lat: 48.87, type: 'Santé' },
      { id: '3', name: 'Café Parisien', address: '45 Boulevard Saint-Germain, Paris', lng: 2.35, lat: 48.85, type: 'Alimentation' },
      { id: '4', name: 'Théâtre de la Ville', address: '8 Avenue des Champs-Élysées, Paris', lng: 2.31, lat: 48.87, type: 'Divertissement' },
      { id: '5', name: 'Restaurant Le Bon', address: '15 Rue de Rivoli, Paris', lng: 2.33, lat: 48.85, type: 'Alimentation' },
    ];
    
    // Filter by category if selected
    let filtered = mockData;
    if (selectedCategory) {
      filtered = filtered.filter(item => item.type === selectedCategory.name);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Limit to count
    filtered = filtered.slice(0, resultCount);
    
    setResults(filtered);
    
    toast({
      title: "Recherche terminée",
      description: `${filtered.length} résultats trouvés`,
      variant: "default",
    });
  };

  useEffect(() => {
    // Load initial results
    handleSearch();
  }, [resultCount, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Barre de recherche */}
      <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <MapPin className="text-gray-500" />
          <Input 
            className="w-full" 
            placeholder="Rechercher un lieu ou une catégorie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Mic className="text-gray-500" />
        </div>
        <Button className="bg-black text-white flex gap-2" onClick={handleSearch}>
          <Search size={16} /> Rechercher
        </Button>
      </div>

      {/* Filtres dynamiques */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              style={{ backgroundColor: cat.color }}
              className="text-white px-4 py-2 rounded-xl"
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>

        {selectedSubcategories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex gap-2 overflow-x-auto pt-2"
          >
            {selectedSubcategories.map((sub) => (
              <Button key={sub} className="bg-gray-200 text-gray-800 rounded-xl px-3 py-1">
                {sub}
              </Button>
            ))}
          </motion.div>
        )}

        <div className="flex gap-4 items-center">
          <label htmlFor="range" className="text-sm">Rayon (km)</label>
          <input
            id="range"
            type="range"
            min={1}
            max={20}
            value={rangeKm}
            onChange={(e) => setRangeKm(Number(e.target.value))}
            className="accent-black"
          />
          <span>{rangeKm} km</span>
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="results" className="text-sm">Résultats</label>
          <input
            id="results"
            type="range"
            min={1}
            max={10}
            value={resultCount}
            onChange={(e) => setResultCount(Number(e.target.value))}
            className="accent-black"
          />
          <span>{resultCount}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {transportModes.map((mode) => (
            <Button
              key={mode.name}
              style={{ backgroundColor: mode.color }}
              className={`text-white rounded-xl ${transport === mode.name ? "ring-2 ring-black" : ""}`}
              onClick={() => setTransport(mode.name)}
            >
              {mode.icon} {mode.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Carte Mapbox */}
      <div className="w-full h-[70vh]">
        <MapboxMap
          results={results}
          transport={transport}
          radius={rangeKm}
          count={resultCount}
          category={selectedCategory?.name || ""}
        />
      </div>

      {/* Résultats en bas avec actions */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((res) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="text-lg font-semibold">{res.name}</div>
                <div className="text-sm text-gray-500">{res.address}</div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="icon"><Heart size={16} /></Button>
                  <Button variant="outline" size="icon"><Share2 size={16} /></Button>
                  <Button variant="outline" size="icon"><Printer size={16} /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
