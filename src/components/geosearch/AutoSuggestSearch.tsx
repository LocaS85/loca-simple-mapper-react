
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, AlertCircle, Info } from 'lucide-react';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { validateMapboxToken } from '@/utils/mapboxValidation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface AutoSuggestSearchProps {
  onResultSelect: (result: { name: string; coordinates: [number, number]; placeName: string }) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

interface SuggestionResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties?: {
    category?: string;
    address?: string;
  };
}

// Utility function to calculate bounding box
const calculateBbox = (center: [number, number], radiusKm: number): [number, number, number, number] => {
  const radiusInDegrees = radiusKm / 111.32; // Approximation: 1 degré ≈ 111.32 km
  return [
    center[0] - radiusInDegrees, // ouest
    center[1] - radiusInDegrees, // sud
    center[0] + radiusInDegrees, // est
    center[1] + radiusInDegrees  // nord
  ];
};

const AutoSuggestSearch: React.FC<AutoSuggestSearchProps> = ({
  onResultSelect,
  placeholder = "Rechercher un lieu ou une adresse...",
  className = "",
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Get user location from store
  const { userLocation } = useGeoSearchStore();

  // Vérifier le token au montage
  useEffect(() => {
    const checkToken = async () => {
      console.log('🔍 Vérification du token Mapbox...');
      
      if (!isMapboxTokenValid()) {
        console.error('❌ Token Mapbox invalide au montage');
        setTokenError(true);
        return;
      }
      
      try {
        const token = getMapboxToken();
        console.log('🔑 Token trouvé:', token.substring(0, 15) + '...');
        
        const isValid = await validateMapboxToken(token);
        if (!isValid) {
          console.error('❌ Validation du token échoué');
          setTokenError(true);
          toast({
            title: 'Token Mapbox invalide',
            description: 'Le token configuré n\'est pas valide pour l\'API Mapbox',
            variant: 'destructive',
          });
        } else {
          console.log('✅ Token Mapbox validé avec succès');
          setTokenError(false);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la validation:', error);
        setTokenError(true);
      }
    };
    
    checkToken();
  }, [toast]);

  useEffect(() => {
    if (initialValue && initialValue !== query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Fonction pour rechercher des suggestions avec l'API Mapbox
  const fetchSuggestions = async (searchText: string) => {
    if (!searchText.trim() || tokenError) {
      setSuggestions([]);
      return;
    }
    
    let mapboxToken: string;
    try {
      mapboxToken = getMapboxToken();
      console.log('🚀 Recherche avec token:', mapboxToken.substring(0, 15) + '...');
    } catch (error) {
      console.error('❌ Token Mapbox manquant');
      setHasError(true);
      setTokenError(true);
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Configuration étendue pour rechercher les établissements commerciaux
      const searchParams = new URLSearchParams({
        access_token: mapboxToken,
        language: 'fr',
        limit: '10',
        // Types étendus pour inclure tous les types de POI
        types: 'poi,address,place,postcode,locality,neighborhood'
      });
      
      // Ajouter la proximité si on a la localisation utilisateur
      if (userLocation) {
        searchParams.append('proximity', `${userLocation[0]},${userLocation[1]}`);
        // Élargir la zone de recherche pour les établissements
        const radius = 25; // 25km autour de la position
        const bbox = calculateBbox(userLocation, radius);
        searchParams.append('bbox', bbox.join(','));
        console.log('📍 Recherche avec proximité et rayon élargi:', userLocation);
      } else {
        // Fallback sur la France avec bbox étendu
        searchParams.append('country', 'fr');
        console.log('🇫🇷 Recherche dans toute la France');
      }
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?${searchParams.toString()}`;
      
      console.log('📡 Requête API:', url.split('?')[0]);
      console.log('🔍 Recherche pour établissement:', searchText);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('📨 Réponse API - Statut:', response.status);
      
      if (response.status === 401) {
        console.error('❌ Erreur 401: Token invalide');
        setTokenError(true);
        toast({
          title: 'Token Mapbox invalide',
          description: 'Le token utilisé n\'est pas autorisé pour cette API',
          variant: 'destructive',
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 Données reçues:', data.features?.length || 0, 'résultats');
      
      if (data.features && Array.isArray(data.features)) {
        // Filtrer et prioriser les POI commerciaux
        const filteredFeatures = data.features.filter((feature: any) => {
          const placeName = feature.place_name.toLowerCase();
          const text = feature.text.toLowerCase();
          const searchLower = searchText.toLowerCase();
          
          // Prioriser les correspondances exactes de nom d'établissement
          return text.includes(searchLower) || placeName.includes(searchLower);
        });
        
        setSuggestions(filteredFeatures);
        console.log(`✅ ${filteredFeatures.length} suggestions trouvées pour "${searchText}"`);
        
        // Log des résultats pour debug
        filteredFeatures.forEach((feature: any, index: number) => {
          console.log(`  ${index + 1}. ${feature.text} (${feature.place_type.join(', ')}) - ${feature.place_name}`);
        });
      } else {
        console.warn('⚠️ Format de réponse inattendu:', data);
        setSuggestions([]);
      }
      
    } catch (error) {
      console.error('❌ Erreur de géocodage:', error);
      setHasError(true);
      
      let errorMessage = 'Impossible de récupérer les suggestions';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Problème de connexion réseau';
        } else if (error.message.includes('401')) {
          errorMessage = 'Token Mapbox invalide';
          setTokenError(true);
        } else if (error.message.includes('403')) {
          errorMessage = 'Accès refusé à l\'API Mapbox';
        }
      }
      
      toast({
        title: 'Erreur de recherche',
        description: errorMessage,
        variant: 'destructive',
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHasError(false);
    
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    if (value.trim().length >= 2 && !tokenError) {
      debounceTimerRef.current = window.setTimeout(() => {
        fetchSuggestions(value.trim());
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: SuggestionResult) => {
    console.log('📍 Suggestion sélectionnée:', suggestion);
    setQuery(suggestion.text);
    setSuggestions([]);
    setIsFocused(false);
    
    onResultSelect({
      name: suggestion.text,
      coordinates: suggestion.center,
      placeName: suggestion.place_name
    });
  };

  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
    setHasError(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      setSuggestions([]);
      return;
    }

    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[0]);
      return;
    }
  };

  const renderPlaceTypeIcon = (placeType: string[]) => {
    const type = placeType[0];
    const iconProps = { size: 16, className: "flex-shrink-0" };
    
    switch (type) {
      case 'poi':
        return <MapPin {...iconProps} className="text-blue-500" />;
      case 'address':
        return <MapPin {...iconProps} className="text-green-500" />;
      case 'place':
      case 'locality':
        return <MapPin {...iconProps} className="text-purple-500" />;
      default:
        return <MapPin {...iconProps} className="text-gray-500" />;
    }
  };

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

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (tokenError) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Configuration Mapbox requise</span>
          </div>
          <p className="text-sm text-red-700 mb-3">
            Le token Mapbox n'est pas valide. Veuillez vérifier votre configuration.
          </p>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Obtenir un token Mapbox →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400 z-10">
          <Search size={18} className={isLoading ? "opacity-50" : ""} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-10 pr-16 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base",
            hasError && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
          aria-label="Recherche de lieu"
          autoComplete="off"
        />
        
        <div className="absolute right-2 flex items-center gap-1">
          {/* Popover d'aide */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 z-10" 
                aria-label="Aide à la recherche"
              >
                <Info size={14} className="text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">💡 Conseils de recherche</p>
                <p>• Tapez au moins 2 caractères pour commencer</p>
                <p>• Recherchez par nom d'établissement, adresse ou lieu</p>
                <p>• Utilisez des mots-clés précis</p>
              </div>
            </PopoverContent>
          </Popover>
          
          {isLoading ? (
            <div className="text-gray-400 z-10">
              <Loader2 size={16} className="animate-spin" />
            </div>
          ) : query ? (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 z-10" 
              onClick={handleClearInput}
              aria-label="Effacer la recherche"
            >
              <X size={14} />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Liste des suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionListRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-[300px] overflow-y-auto border border-gray-200"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id || index}
              className="w-full text-left px-3 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer border-b last:border-0 border-gray-100 flex items-start gap-3 transition-colors"
              onClick={() => handleSuggestionSelect(suggestion)}
              role="option"
              tabIndex={0}
            >
              <div className="flex-shrink-0 mt-0.5">
                {renderPlaceTypeIcon(suggestion.place_type)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-sm text-gray-900 mb-0.5">
                  {suggestion.text}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {suggestion.place_name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* États vides et d'erreur */}
      {isFocused && query.trim().length >= 2 && suggestions.length === 0 && !isLoading && !hasError && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <div className="text-gray-400 mb-2">
            <Search size={20} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Aucun résultat trouvé pour "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">Essayez avec un autre terme de recherche</p>
        </div>
      )}

      {isFocused && hasError && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-red-200 p-4 text-center">
          <div className="text-red-400 mb-2">
            <X size={20} className="mx-auto" />
          </div>
          <p className="text-sm text-red-600">Erreur de connexion</p>
          <p className="text-xs text-gray-500 mt-1">Vérifiez votre connexion internet</p>
        </div>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
