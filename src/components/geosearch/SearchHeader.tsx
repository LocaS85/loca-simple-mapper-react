import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RotateCcw, MapPin, Loader2 } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';

interface SearchHeaderProps {
  filters: GeoSearchFilters;
  isLoading: boolean;
  onSearch: (query?: string) => void;
  onFiltersToggle: () => void;
  onResetFilters: () => void;
  onMyLocationClick: () => void;
  showFilters: boolean;
  canSearch: boolean;
  resultsCount: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  isLoading,
  onSearch,
  onFiltersToggle,
  onResetFilters,
  onMyLocationClick,
  showFilters,
  canSearch,
  resultsCount
}) => {
  const [localQuery, setLocalQuery] = React.useState(filters.query || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(localQuery);
    }
  };

  return (
    <div className="bg-white border-b shadow-sm p-4 space-y-4">
      {/* Barre de recherche principale */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Rechercher des lieux (restaurants, pharmacies...)"
            className="pl-10 pr-4 py-2"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !canSearch}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Ligne des boutons d'action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bouton Ma Position */}
          <Button
            variant="outline"
            size="sm"
            onClick={onMyLocationClick}
            disabled={isLoading}
            className="bg-white"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ma position
          </Button>

          {/* Bouton Filtres */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={onFiltersToggle}
            className={showFilters ? "" : "bg-white"}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </Button>

          {/* Bouton Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Compteur de résultats */}
        <div className="text-sm text-gray-600">
          {isLoading ? (
            'Recherche en cours...'
          ) : (
            `${resultsCount} résultat${resultsCount > 1 ? 's' : ''}`
          )}
        </div>
      </div>

      {/* Affichage des filtres actifs */}
      {(filters.category || filters.transport !== 'walking' || filters.distance !== 5) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {filters.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              📂 {filters.category}
            </span>
          )}
          {filters.transport !== 'walking' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              🚶 {filters.transport === 'driving' ? '🚗 Voiture' : 
                   filters.transport === 'cycling' ? '🚴 Vélo' : 
                   filters.transport === 'transit' ? '🚌 Transport' : 'À pied'}
            </span>
          )}
          {filters.distance !== 5 && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              📏 {filters.distance} km
            </span>
          )}
          {filters.aroundMeCount !== 3 && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
              🔢 {filters.aroundMeCount} résultats
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchHeader;