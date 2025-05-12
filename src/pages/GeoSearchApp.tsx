
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";
import CategorySelector from "@/components/CategorySelector";
import SubcategorySelector from "@/components/SubcategorySelector";
import RangeSelector from "@/components/RangeSelector";
import TransportSelector from "@/components/TransportSelector";
import ResultsList from "@/components/ResultsList";
import MapboxMap from "@/components/MapboxMap";
import { motion } from "framer-motion";
import { categoriesData } from "@/data/categories";
import { Category } from "@/types";

// Mock data for demonstration
const mockData = [
  { id: '1', name: 'Cinéma Gaumont', address: '123 Rue de Cinema, Paris', lng: 2.34, lat: 48.86, type: 'Divertissement' },
  { id: '2', name: 'Centre médical', address: '1 Avenue Claude Vellefaux, Paris', lng: 2.37, lat: 48.87, type: 'Santé' },
  { id: '3', name: 'Café Parisien', address: '45 Boulevard Saint-Germain, Paris', lng: 2.35, lat: 48.85, type: 'Alimentation' },
  { id: '4', name: 'Théâtre de la Ville', address: '8 Avenue des Champs-Élysées, Paris', lng: 2.31, lat: 48.87, type: 'Divertissement' },
  { id: '5', name: 'Restaurant Le Bon', address: '15 Rue de Rivoli, Paris', lng: 2.33, lat: 48.85, type: 'Alimentation' },
];

// Map the mock categories to our Category type
const categories: Category[] = [
  { id: "divertissement", name: "Divertissement", color: "#8e44ad", icon: "🎬", subcategories: [] },
  { id: "sante", name: "Santé", color: "#27ae60", icon: "🧘", subcategories: [] },
  { id: "alimentation", name: "Alimentation", color: "#e67e22", icon: "🍔", subcategories: [] },
];

// Transport modes data
const transportModes = [
  { id: "driving", name: "Voiture", icon: "🚗", color: "#2980b9" },
  { id: "walking", name: "À pied", icon: "🚶", color: "#2ecc71" },
  { id: "cycling", name: "Vélo", icon: "🚴", color: "#e67e22" },
  { id: "transit", name: "Train", icon: "🚆", color: "#9b59b6" },
];

export default function GeoSearchApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [transport, setTransport] = useState("Voiture");
  const [rangeKm, setRangeKm] = useState(5);
  const [resultCount, setResultCount] = useState(3);
  const { toast } = useToast();

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    // If the category has subcategories, set them
    setSelectedSubcategories(cat.subcategories?.map(sub => sub.name) || []);
  };

  const handleSearch = () => {
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
    // Load initial results when component mounts
    handleSearch();
  }, [resultCount, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onSearch={handleSearch} 
      />

      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b"
      >
        <CategorySelector 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategoryClick} 
        />
        
        <SubcategorySelector subcategories={selectedSubcategories} />
        
        <RangeSelector 
          label="Rayon"
          value={rangeKm}
          min={1}
          max={20}
          onChange={setRangeKm}
          unit="km"
        />
        
        <RangeSelector 
          label="Résultats"
          value={resultCount}
          min={1}
          max={10}
          onChange={setResultCount}
        />
        
        <TransportSelector 
          transportModes={transportModes.map(t => ({ name: t.name, icon: t.icon, color: t.color }))}
          selectedTransport={transport}
          onTransportSelect={setTransport}
        />
      </motion.div>

      <div className="w-full h-[70vh]">
        <MapboxMap
          results={results}
          transport={transport}
          radius={rangeKm}
          count={resultCount}
          category={selectedCategory?.name || ""}
        />
      </div>

      <ResultsList results={results} />
    </div>
  );
}
