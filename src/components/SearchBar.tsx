
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Mic, Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder = "Rechercher un lieu ou une catégorie...",
  onClear
}) => {
  const isMobile = useIsMobile();

  const handleClear = () => {
    onSearchChange("");
    if (onClear) onClear();
  };

  return (
    <div className="p-3 lg:p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shadow-md bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-2 w-full lg:w-2/3 xl:w-1/2">
        <div className="relative flex items-center flex-1">
          <MapPin className="absolute left-3 text-gray-400 z-10" size={isMobile ? 18 : 20} />
          <Input 
            className="w-full pl-10 pr-20 h-11 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all" 
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X size={16} className="text-gray-400" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-50 rounded-full"
              title="Recherche vocale"
            >
              <Mic size={16} className="text-blue-500" />
            </Button>
          </div>
        </div>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2 h-11 lg:h-12 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl" 
        onClick={onSearch}
      >
        <Search size={isMobile ? 16 : 18} />
        {!isMobile && "Rechercher"}
      </Button>
    </div>
  );
};

export default SearchBar;
