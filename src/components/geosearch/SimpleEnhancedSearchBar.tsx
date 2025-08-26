import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mapboxSearchService } from '@/services/mapbox/searchService';

interface SimpleEnhancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  userLocation?: [number, number];
  disabled?: boolean;
  className?: string;
}

const SimpleEnhancedSearchBar: React.FC<SimpleEnhancedSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onLocationSelect,
  placeholder = "Rechercher des lieux...",
  userLocation,
  disabled = false,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-suggestion avec Mapbox
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        console.log('🔍 Recherche autosuggestion:', { query: value, userLocation });
        
        try {
          // Utilise userLocation ou Paris comme fallback
          const searchLocation = userLocation || [2.3522, 48.8566] as [number, number]; // Paris
          
          console.log('📍 Position utilisée pour la recherche:', searchLocation);
          
          // Recherche optimisée pour POI et établissements commerciaux
          const results = await mapboxSearchService.searchPlaces(value, searchLocation, { 
            limit: 10,
            categories: ['poi', 'address', 'place', 'region', 'postcode', 'locality', 'neighborhood', 'district']
          });
          
          console.log('✅ Résultats reçus:', results);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          
          // Afficher un message si aucun résultat trouvé
          if (results.length === 0) {
            const { toast } = await import('sonner');
            toast.info(`Aucun POI trouvé pour "${value}". Essayez un terme plus général.`);
          }
          
        } catch (error) {
          console.error('❌ Erreur autosuggestion:', error);
          const { useToast } = await import('@/hooks/use-toast');
          const { toast } = useToast();
          toast({
            title: "Erreur de recherche",
            description: "Impossible de récupérer les suggestions. Vérifiez la configuration Mapbox.",
            variant: "destructive",
          });
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, userLocation]);

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.name);
    onSearch(suggestion.name);
    if (onLocationSelect) {
      onLocationSelect({
        name: suggestion.name,
        coordinates: suggestion.coordinates,
        placeName: suggestion.address
      });
    }
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Suggestions dropdown avec amélioration POI */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2 text-xs text-muted-foreground bg-muted/50 border-b">
            {suggestions.length} lieu{suggestions.length > 1 ? 'x' : ''} trouvé{suggestions.length > 1 ? 's' : ''}
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{suggestion.name}</div>
                <div className="text-xs text-muted-foreground truncate">{suggestion.address}</div>
                <div className="flex items-center gap-2 mt-1">
                  {suggestion.distance && (
                    <div className="text-xs text-muted-foreground">
                      {suggestion.distance.toFixed(1)} km
                    </div>
                  )}
                  {suggestion.category && (
                    <div className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {suggestion.category}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Message si aucun résultat */}
      {showSuggestions && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 p-3 text-center text-muted-foreground text-sm">
          Aucun lieu trouvé pour "{value}". Essayez un terme plus général.
        </div>
      )}
    </div>
  );
};

export default SimpleEnhancedSearchBar;