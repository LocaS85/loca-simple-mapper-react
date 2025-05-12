
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Mic, Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
}) => {
  return (
    <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between shadow-md bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <MapPin className="text-gray-500" />
        <Input 
          className="w-full" 
          placeholder="Rechercher un lieu ou une catégorie..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Mic className="text-gray-500" />
      </div>
      <Button className="bg-black text-white flex gap-2" onClick={onSearch}>
        <Search size={16} /> Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
