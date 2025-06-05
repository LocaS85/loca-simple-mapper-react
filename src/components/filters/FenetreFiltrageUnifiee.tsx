
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { TransportMode } from '@/lib/data/transportModes';
import { Car, User, Bike, Bus, X } from 'lucide-react';

// Données des catégories
const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'hotel', label: 'Hôtels' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'entertainment', label: 'Divertissement' },
  { value: 'education', label: 'Éducation' },
  { value: 'transport', label: 'Transport' }
];

const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  restaurant: [
    { value: 'fast_food', label: 'Fast Food' },
    { value: 'fine_dining', label: 'Gastronomie' },
    { value: 'cafe', label: 'Café' },
    { value: 'bar', label: 'Bar' }
  ],
  hotel: [
    { value: 'budget', label: 'Budget' },
    { value: 'luxury', label: 'Luxe' },
    { value: 'boutique', label: 'Boutique' }
  ],
  shopping: [
    { value: 'mall', label: 'Centre commercial' },
    { value: 'market', label: 'Marché' },
    { value: 'boutique', label: 'Boutique' }
  ]
};

interface FenetreFiltrageUnifieeProps {
  open: boolean;
  onClose: () => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  subcategory: string | null;
  setSubcategory: (subcategory: string | null) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  maxDuration: number;
  setMaxDuration: (duration: number) => void;
  aroundMeCount: number;
  setAroundMeCount: (count: number) => void;
  showMultiDirections: boolean;
  setShowMultiDirections: (show: boolean) => void;
  distanceUnit: 'km' | 'mi';
  setDistanceUnit: (unit: 'km' | 'mi') => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
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
  const { t } = useTranslation();

  const transportModeIcons = {
    car: <Car className="h-4 w-4" />,
    walking: <User className="h-4 w-4" />,
    cycling: <Bike className="h-4 w-4" />,
    bus: <Bus className="h-4 w-4" />,
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'none') {
      setCategory(null);
      setSubcategory(null);
    } else {
      setCategory(value);
      setSubcategory(null);
    }
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === 'none') {
      setSubcategory(null);
    } else {
      setSubcategory(value);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[90%] sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Filtres de recherche</SheetTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Catégorie */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Catégorie</h3>
            <Select value={category || 'none'} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Toutes les catégories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sous-catégorie */}
          {category && SUBCATEGORIES[category] && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Sous-catégorie</h3>
              <Select value={subcategory || 'none'} onValueChange={handleSubcategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Toutes les sous-catégories</SelectItem>
                  {SUBCATEGORIES[category].map((subcat) => (
                    <SelectItem key={subcat.value} value={subcat.value}>
                      {subcat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mode de transport */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Mode de transport</h3>
            <div className="flex flex-wrap gap-2">
              {(['car', 'walking', 'cycling', 'bus'] as TransportMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={transportMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTransportMode(mode)}
                  className="flex items-center gap-2"
                >
                  {transportModeIcons[mode]}
                  {mode === 'car' && 'Voiture'}
                  {mode === 'walking' && 'Marche'}
                  {mode === 'cycling' && 'Vélo'}
                  {mode === 'bus' && 'Transport'}
                </Button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Distance maximale</h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{maxDistance}</span>
                <div className="flex rounded-md overflow-hidden border border-border">
                  <button
                    onClick={() => setDistanceUnit('km')}
                    className={`px-2 py-1 text-xs ${
                      distanceUnit === 'km' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    km
                  </button>
                  <button
                    onClick={() => setDistanceUnit('mi')}
                    className={`px-2 py-1 text-xs ${
                      distanceUnit === 'mi' ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    mi
                  </button>
                </div>
              </div>
            </div>
            <Slider
              value={[maxDistance]}
              min={1}
              max={distanceUnit === 'km' ? 50 : 30}
              step={1}
              onValueChange={(values) => setMaxDistance(values[0])}
            />
          </div>

          {/* Durée maximale */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Durée maximale</h3>
              <span className="font-semibold">{maxDuration} min</span>
            </div>
            <Slider
              value={[maxDuration]}
              min={5}
              max={60}
              step={5}
              onValueChange={(values) => setMaxDuration(values[0])}
            />
          </div>

          {/* Nombre de résultats */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Nombre de résultats</h3>
              <span className="font-semibold">{aroundMeCount}</span>
            </div>
            <Slider
              value={[aroundMeCount]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => setAroundMeCount(values[0])}
            />
          </div>

          {/* Directions multiples */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Afficher toutes les directions</h3>
            <Button
              variant={showMultiDirections ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMultiDirections(!showMultiDirections)}
            >
              {showMultiDirections ? 'Oui' : 'Non'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
          <Button className="w-full" onClick={onClose}>
            Appliquer les filtres
          </Button>
          {onReset && (
            <Button variant="outline" className="w-full" onClick={onReset}>
              Réinitialiser
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FenetreFiltrageUnifiee;
