
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { getMapboxToken } from '@/utils/mapboxConfig';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface AutoSuggestSearchProps {
  onResultSelect: (result: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  className?: string;
}

interface SuggestionResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

const AutoSuggestSearch: React.FC<AutoSuggestSearchProps> = ({
  onResultSelect,
  placeholder = "Rechercher un lieu ou une adresse...",
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Récupérer le token Mapbox
  const mapboxToken = getMapboxToken();

  // Fonction pour rechercher des suggestions
  const fetchSuggestions = async (searchText: string) => {
    if (!searchText.trim() || !mapboxToken) return;
    
    setIsLoading(true);
    
    try {
      // Construire l'URL de recherche Mapbox avec des paramètres pour la France
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${mapboxToken}&country=fr&language=fr&limit=5`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      toast({
        title: 'Erreur de recherche',
        description: 'Impossible de récupérer les suggestions',
        variant: 'destructive',
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la saisie avec debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Annuler le timer précédent
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Définir un nouveau timer pour le debounce (300ms)
    debounceTimerRef.current = window.setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion: SuggestionResult) => {
    setQuery(suggestion.text);
    setSuggestions([]);
    onResultSelect({
      name: suggestion.text,
      coordinates: suggestion.center,
      placeName: suggestion.place_name
    });
    setIsFocused(false);
  };

  // Effacer la saisie
  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Gérer le clic en dehors des suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionListRef.current && 
        !suggestionListRef.current.contains(e.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Nettoyer le timer lors du démontage
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Search size={18} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        
        {isLoading ? (
          <div className="absolute right-3 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : query ? (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="absolute right-2 h-7 w-7" 
            onClick={handleClearInput}
          >
            <X size={16} />
          </Button>
        ) : null}
      </div>

      {/* Liste des suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionListRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-[300px] overflow-y-auto border border-gray-200"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-0 border-gray-100"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="font-medium text-sm">{suggestion.text}</div>
              <div className="text-xs text-gray-500 truncate">{suggestion.place_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
