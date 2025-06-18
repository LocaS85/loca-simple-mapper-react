
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw } from 'lucide-react';
import { GeoSearchFilters } from '@/types/geosearch';
import { TransportMode } from '@/lib/data/transportModes';

interface GeoSearchFiltersPanelProps {
  filters: GeoSearchFilters;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onTransportChange: (transport: TransportMode) => void;
  onClearCache: () => void;
  isLoading: boolean;
}

const GeoSearchFiltersPanel: React.FC<GeoSearchFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onTransportChange,
  onClearCache,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Catégorie</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFiltersChange({ category: e.target.value || null })}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          >
            <option value="">Toutes les catégories</option>
            <option value="restaurant">Restaurants</option>
            <option value="hotel">Hôtels</option>
            <option value="shop">Boutiques</option>
            <option value="hospital">Hôpitaux</option>
            <option value="school">Écoles</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Transport</label>
          <select
            value={filters.transport || 'walking'}
            onChange={(e) => onTransportChange(e.target.value as TransportMode)}
            className="w-full p-2 border rounded-md"
            disabled={isLoading}
          >
            <option value="walking">À pied</option>
            <option value="driving">En voiture</option>
            <option value="cycling">À vélo</option>
            <option value="transit">Transport public</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Distance max: {filters.distance || 10} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.distance || 10}
            onChange={(e) => onFiltersChange({ distance: parseInt(e.target.value) })}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Nombre de résultats: {filters.aroundMeCount || 5}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={filters.aroundMeCount || 5}
            onChange={(e) => onFiltersChange({ aroundMeCount: parseInt(e.target.value) })}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div className="pt-4 space-y-2">
          <Button
            variant="outline"
            onClick={onClearCache}
            className="w-full"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Vider le cache
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeoSearchFiltersPanel;
