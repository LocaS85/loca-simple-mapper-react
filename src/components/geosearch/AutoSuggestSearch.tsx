import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { getMapboxToken, isMapboxTokenValid, validateMapboxToken } from '@/utils/mapboxConfig';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [customToken, setCustomToken] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Vérifier le token au montage
  useEffect(() => {
    const checkToken = async () => {
      if (!isMapboxTokenValid()) {
        setTokenError(true);
        return;
      }
      
      try {
        const token = getMapboxToken();
        const isValid = await validateMapboxToken(token);
        if (!isValid) {
          setTokenError(true);
          toast({
            title: 'Token Mapbox invalide',
            description: 'Veuillez configurer un token Mapbox valide',
            variant: 'destructive',
          });
        }
      } catch (error) {
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

  // Fonction pour rechercher des suggestions avec gestion d'erreurs améliorée
  const fetchSuggestions = async (searchText: string) => {
    if (!searchText.trim() || tokenError) {
      setSuggestions([]);
      return;
    }
    
    let mapboxToken: string;
    try {
      mapboxToken = customToken || getMapboxToken();
    } catch (error) {
      console.error('Token Mapbox manquant');
      setHasError(true);
      setTokenError(true);
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Configuration optimisée pour la France avec plus de types de lieux
      const searchParams = new URLSearchParams({
        access_token: mapboxToken,
        country: 'fr',
        language: 'fr',
        limit: '8',
        types: 'place,address,poi,postcode,locality,neighborhood',
        // Ajouter une bbox pour la France pour améliorer la pertinence
        bbox: '-5.559,41.26,9.662,51.312'
      });
      
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?${searchParams.toString()}`;
      
      console.log('Fetching suggestions from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.status === 401) {
        setTokenError(true);
        toast({
          title: 'Token Mapbox invalide',
          description: 'Le token Mapbox utilisé n\'est pas valide. Veuillez le vérifier.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Mapbox API response:', data);
      
      if (data.features && Array.isArray(data.features)) {
        setSuggestions(data.features);
        console.log(`Found ${data.features.length} suggestions for "${searchText}"`);
      } else {
        console.warn('Format de réponse inattendu:', data);
        setSuggestions([]);
      }
      
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      setHasError(true);
      
      // Gestion d'erreur plus détaillée
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

  // Gérer la saisie avec debounce optimisé
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHasError(false);
    
    // Annuler le timer précédent
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Rechercher immédiatement si plus de 2 caractères
    if (value.trim().length >= 2 && !tokenError) {
      debounceTimerRef.current = window.setTimeout(() => {
        fetchSuggestions(value.trim());
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Gérer la validation du token personnalisé
  const handleTokenValidation = async () => {
    if (!customToken.trim()) return;
    
    setIsLoading(true);
    const isValid = await validateMapboxToken(customToken);
    
    if (isValid) {
      setTokenError(false);
      localStorage.setItem('MAPBOX_ACCESS_TOKEN', customToken);
      toast({
        title: 'Token validé',
        description: 'Le token Mapbox a été configuré avec succès',
      });
    } else {
      toast({
        title: 'Token invalide',
        description: 'Le token fourni n\'est pas valide',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion: SuggestionResult) => {
    console.log('Suggestion selected:', suggestion);
    setQuery(suggestion.text);
    setSuggestions([]);
    setIsFocused(false);
    
    onResultSelect({
      name: suggestion.text,
      coordinates: suggestion.center,
      placeName: suggestion.place_name
    });
  };

  // Effacer la saisie
  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
    setHasError(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Navigation clavier améliorée
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

    if (!suggestions.length) return;

    // Navigation avec les flèches
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const activeElement = document.activeElement;
      const suggestionElements = document.querySelectorAll('[data-suggestion-id]');
      
      if (suggestionElements.length === 0) return;
      
      let currentIndex = -1;
      suggestionElements.forEach((el, index) => {
        if (el === activeElement) currentIndex = index;
      });
      
      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, suggestionElements.length - 1);
      } else {
        nextIndex = currentIndex <= 0 ? suggestionElements.length - 1 : currentIndex - 1;
      }
      
      (suggestionElements[nextIndex] as HTMLElement)?.focus();
    }
  };

  // Icône pour le type de lieu
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

  // Gérer les clics externes
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

  // Nettoyer le timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Afficher l'interface de configuration du token si nécessaire
  if (tokenError) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Configuration Mapbox requise</span>
          </div>
          <p className="text-sm text-red-700 mb-3">
            Le token Mapbox n'est pas valide. Veuillez entrer votre token d'accès.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="pk.eyJ1..."
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm"
            />
            <Button
              onClick={handleTokenValidation}
              disabled={!customToken.trim() || isLoading}
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider'}
            </Button>
          </div>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
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
            "w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors",
            hasError && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
          aria-label="Recherche de lieu"
          autoComplete="off"
        />
        
        {isLoading ? (
          <div className="absolute right-3 text-gray-400 z-10">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : query ? (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className="absolute right-2 h-7 w-7 z-10" 
            onClick={handleClearInput}
            aria-label="Effacer la recherche"
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
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id || index}
              data-suggestion-id={suggestion.id || index}
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
      
      {/* Message d'état vide */}
      {isFocused && query.trim().length >= 2 && suggestions.length === 0 && !isLoading && !hasError && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <div className="text-gray-400 mb-2">
            <Search size={20} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Aucun résultat trouvé pour "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">Essayez avec un autre terme de recherche</p>
        </div>
      )}

      {/* Message d'erreur */}
      {isFocused && hasError && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-red-200 p-4 text-center">
          <div className="text-red-400 mb-2">
            <X size={20} className="mx-auto" />
          </div>
          <p className="text-sm text-red-600">Erreur de connexion</p>
          <p className="text-xs text-gray-500 mt-1">Vérifiez votre connexion internet</p>
        </div>
      )}

      {/* Instruction pour l'utilisateur */}
      {isFocused && query.length < 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">Tapez au moins 2 caractères pour rechercher</p>
        </div>
      )}
    </div>
  );
};

export default AutoSuggestSearch;
