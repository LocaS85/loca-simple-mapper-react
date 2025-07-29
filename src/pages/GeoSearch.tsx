
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  MapPin,
  ChevronDown,
  X,
  Search,
  ArrowLeft,
  Clock,
  Ruler,
  Car,
  Bike,
  Footprints,
  Bus
} from 'lucide-react';

// Fallback component
const GeoSearchErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur de recherche géographique</h2>
      <p className="text-gray-600 mb-4">
        {error.message || "Impossible de charger la recherche géographique"}
      </p>
      <div className="flex gap-2 justify-center">
        <Button onClick={resetErrorBoundary}>Réessayer</Button>
        <Button asChild variant="outline">
          <Link to="/">Accueil</Link>
        </Button>
      </div>
    </div>
  </div>
);

// Nouveau composant principal optimisé
const GeoSearchApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState(5);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [distance, setDistance] = useState(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mile'>('km');
  const [duration, setDuration] = useState(15);
  const [transportMode, setTransportMode] = useState<'walking' | 'driving' | 'cycling' | 'transit'>('walking');

  // Données de démonstration
  const categories = {
    'Restaurants & Alimentation': ['Fast-food', 'Gastronomique', 'Asiatique', 'Boulangeries'],
    'Shopping & Commerce': ['Centres commerciaux', 'Boutiques', 'Marchés'],
    'Santé & Bien-être': ['Pharmacies', 'Hôpitaux', 'Salles de sport'],
    'Éducation & Culture': ['Écoles', 'Bibliothèques', 'Musées'],
    'Transport & Mobilité': ['Stations', 'Parkings', 'Locations'],
    'Loisirs & Divertissement': ['Cinémas', 'Parcs', 'Bars']
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Barre de navigation supérieure minimaliste */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/categories">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Position
              </span>
              <Button variant="outline" size="sm" className="h-8">
                <MapPin size={14} className="mr-1" />
                Détecter ma position
              </Button>
            </div>
          </div>

          {/* Catégories horizontales */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeFilters.some(f => categories[cat as keyof typeof categories].includes(f))
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat.split(' & ')[0]}
              </button>
            ))}
          </div>

          {/* Bouton filtres popup à droite */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter size={18} />
                {activeFilters.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-80 p-0">
              <div className="h-full flex flex-col">
                {/* Header du popup */}
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Filtres & Recherche</h2>
                    {activeFilters.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Tout effacer
                      </Button>
                    )}
                  </div>
                  
                  {/* Barre de recherche */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Transport Mode */}
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Car size={16} className="text-primary" />
                      Mode de transport
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'walking', icon: Footprints, label: 'À pied' },
                        { id: 'driving', icon: Car, label: 'Voiture' },
                        { id: 'cycling', icon: Bike, label: 'Vélo' },
                        { id: 'transit', icon: Bus, label: 'Transport' }
                      ].map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          onClick={() => setTransportMode(id as any)}
                          className={`p-2 rounded-lg border text-sm flex items-center gap-2 transition-colors ${
                            transportMode === id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted border-border'
                          }`}
                        >
                          <Icon size={16} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-sm flex items-center gap-2">
                        <Ruler size={16} className="text-primary" />
                        Distance maximale
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                          {distance} {distanceUnit}
                        </span>
                        <div className="flex border rounded-md overflow-hidden">
                          <button
                            onClick={() => setDistanceUnit('km')}
                            className={`px-2 py-1 text-xs ${
                              distanceUnit === 'km' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            km
                          </button>
                          <button
                            onClick={() => setDistanceUnit('mile')}
                            className={`px-2 py-1 text-xs ${
                              distanceUnit === 'mile' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            mi
                          </button>
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={distanceUnit === 'km' ? 50 : 31}
                      value={distance}
                      onChange={(e) => setDistance(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 {distanceUnit}</span>
                      <span>{distanceUnit === 'km' ? 50 : 31} {distanceUnit}</span>
                    </div>
                  </div>

                  {/* Durée */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-sm flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        Durée maximale
                      </label>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                        {duration} min
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5 min</span>
                      <span>2h</span>
                    </div>
                  </div>

                  {/* Nombre autour de moi */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-sm flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        Nombre de résultats
                      </label>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                        {resultsCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={resultsCount}
                      onChange={(e) => setResultsCount(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  {/* Filtres actifs */}
                  {activeFilters.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm mb-3">Filtres actifs ({activeFilters.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.map(filter => (
                          <span 
                            key={filter}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {filter}
                            <button 
                              onClick={() => toggleFilter(filter)}
                              className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Catégories */}
                  <div>
                    <h3 className="font-medium text-sm mb-3">Catégories</h3>
                    <div className="space-y-2">
                      {Object.entries(categories).map(([category, subcategories]) => (
                        <div key={category} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={`w-full p-3 flex justify-between items-center text-left text-sm transition-colors ${
                              selectedCategory === category ? 'bg-muted' : 'hover:bg-muted/50'
                            }`}
                          >
                            <span className="font-medium">{category}</span>
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform ${
                                selectedCategory === category ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          
                          {selectedCategory === category && (
                            <div className="bg-muted/30 border-t">
                              {subcategories.map(sub => (
                                <button
                                  key={sub}
                                  onClick={() => toggleFilter(sub)}
                                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                    activeFilters.includes(sub)
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-muted/50'
                                  }`}
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Carte plein écran */}
      <div className="h-full w-full pt-16">
        <div className="h-full w-full bg-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-muted border-2 border-dashed border-muted-foreground/30 rounded-xl w-96 h-64 mb-4 flex items-center justify-center">
              <MapPin size={48} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Carte interactive plein écran</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Navigation optimisée avec contrôles minimalistes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeoSearch = () => (
  <ErrorBoundary 
    FallbackComponent={GeoSearchErrorFallback}
    onError={(error, errorInfo) => {
      console.error('GeoSearch error:', error, errorInfo);
    }}
  >
    <GeoSearchApp />
  </ErrorBoundary>
);

export default GeoSearch;
