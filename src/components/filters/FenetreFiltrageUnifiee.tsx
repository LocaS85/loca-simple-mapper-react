
import React from 'react';
import { TransportMode, DistanceUnit } from '@/types/map';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Filter, Car, User, Bike, Train } from 'lucide-react';
import { unifiedCategories } from '@/data/unifiedCategories';

interface FenetreFiltrageUnifieeProps {
  open: boolean;
  onClose: () => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  subcategory: string | null;
  setSubcategory: (value: string | null) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  maxDuration: number;
  setMaxDuration: (value: number) => void;
  aroundMeCount: number;
  setAroundMeCount: (value: number) => void;
  showMultiDirections: boolean;
  setShowMultiDirections: (value: boolean) => void;
  distanceUnit: DistanceUnit;
  setDistanceUnit: (value: DistanceUnit) => void;
  transportMode: TransportMode;
  setTransportMode: (value: TransportMode) => void;
  onReset?: () => void;
}

const FenetreFiltrageUnifiee: React.FC<FenetreFiltrageUnifieeProps> = ({
  open,
  onClose,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  maxDistance,
  setMaxDistance,
  maxDuration,
  setMaxDuration,
  aroundMeCount,
  setAroundMeCount,
  showMultiDirections,
  setShowMultiDirections,
  distanceUnit,
  setDistanceUnit,
  transportMode,
  setTransportMode,
  onReset
}) => {
  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'driving': return <Car className="h-4 w-4" />;
      case 'walking': return <User className="h-4 w-4" />;
      case 'cycling': return <Bike className="h-4 w-4" />;
      case 'transit': return <Train className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    onClose();
  };

  const selectedCategory = unifiedCategories.find(cat => cat.id === category);
  const subcategories = selectedCategory?.subcategories || [];

  if (!open) return null;

  return (
    <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres de recherche
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Catégorie */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={category || ''} onValueChange={(value) => setCategory(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {unifiedCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {subcategories.length > 0 && (
              <Select value={subcategory || ''} onValueChange={(value) => setSubcategory(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les sous-catégories</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Transport */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {getTransportIcon(transportMode)}
              Mode de transport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={transportMode} onValueChange={(value) => setTransportMode(value as TransportMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walking">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    À pied
                  </div>
                </SelectItem>
                <SelectItem value="cycling">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4" />
                    Vélo
                  </div>
                </SelectItem>
                <SelectItem value="driving">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Voiture
                  </div>
                </SelectItem>
                <SelectItem value="transit">
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4" />
                    Transports
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Distance et Durée */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Distance et durée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-gray-600">
                Distance maximale: {maxDistance} {distanceUnit}
              </Label>
              <Slider
                value={[maxDistance]}
                onValueChange={(value) => setMaxDistance(value[0])}
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600">
                Durée maximale: {maxDuration} min
              </Label>
              <Slider
                value={[maxDuration]}
                onValueChange={(value) => setMaxDuration(value[0])}
                max={60}
                min={5}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs">Unité</Label>
              <Select value={distanceUnit} onValueChange={(value) => setDistanceUnit(value as DistanceUnit)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="mi">mi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nombre de résultats</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-xs text-gray-600">
                Résultats à afficher: {aroundMeCount}
              </Label>
              <Slider
                value={[aroundMeCount]}
                onValueChange={(value) => setAroundMeCount(value[0])}
                max={20}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Options avancées */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Options avancées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Itinéraires multiples</Label>
              <Switch
                checked={showMultiDirections}
                onCheckedChange={setShowMultiDirections}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 flex-1"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={onClose} className="flex-1">
            Appliquer
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default FenetreFiltrageUnifiee;
