import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, Filter, Share2, Download, Layers, Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { TransportMode } from '@/lib/data/transportModes';

// Components
import ModernFilterPanel from '@/components/filters/ModernFilterPanel';
import OptimizedFilterButton from '@/components/filters/OptimizedFilterButton';
import EnhancedSearchBar from '@/components/geosearch/EnhancedSearchBar';
import MapboxSearchMap from '@/components/geosearch/MapboxSearchMap';
import MultiDirectionalSearch from '@/components/geosearch/MultiDirectionalSearch';
import SEOHead from '@/components/SEOHead';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Hooks & Stores
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useEnhancedGeolocation } from '@/hooks/useEnhancedGeolocation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';

// Services & Utils
import { CacheService } from '@/services/cacheService';
import { AnalyticsService } from '@/services/analyticsService';
import { OfflineStorageService } from '@/services/offlineStorageService';

// Types
interface SearchSettings {
  autoSuggest: boolean;
  multiDirections: boolean;
  cacheEnabled: boolean;
  offlineMode: boolean;
  analyticsEnabled: boolean;
  maxResults: number;
  defaultTransport: TransportMode;
}

interface RouteData {
  id: string;
  coordinates: number[][];
  color: string;
  distance: number;
  duration: number;
  origin: [number, number];
  destination: [number, number];
  poiInfo: {
    name: string;
    category: string;
    rating?: number;
  };
}

// Services initialization
const cacheService = new CacheService();
const analyticsService = new AnalyticsService();
const offlineStorage = new OfflineStorageService();

export default function Search() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  // États principaux
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [manualFiltersActive, setManualFiltersActive] = useState(false);
  const [showMultiDirections, setShowMultiDirections] = useState(false);
  const [multiRoutes, setMultiRoutes] = useState<RouteData[]>([]);
  const [searchOrigin, setSearchOrigin] = useState<'position' | 'address'>('position');
  const [selectedOriginAddress, setSelectedOriginAddress] = useState<any>(null);
  
  // Paramètres utilisateur
  const [settings, setSettings] = useState<SearchSettings>({
    autoSuggest: true,
    multiDirections: false,
    cacheEnabled: true,
    offlineMode: false,
    analyticsEnabled: true,
    maxResults: 3,
    defaultTransport: 'walking' as TransportMode
  });

  // Store Zustand
  const {
    userLocation,
    results,
    filters,
    isLoading,
    distanceMode,
    setUserLocation,
    updateFilters,
    performSearch,
    setDistanceMode
  } = useGeoSearchStore();

  // Géolocalisation
  const { coordinates: currentLocation, getCurrentLocation } = useEnhancedGeolocation();
  const { userAddresses, transportModes, loading: addressesLoading } = useSupabaseCategories();

  // Initialisation
  useEffect(() => {
    // Charger les paramètres depuis le localStorage
    const savedSettings = localStorage.getItem('searchSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Charger l'historique de recherche
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Initialiser le mode de transport par défaut
    updateFilters({ transport: settings.defaultTransport as TransportMode });

    // Charger les données offline si disponibles
    if (settings.offlineMode) {
      offlineStorage.loadOfflineData();
    }
  }, []);

  // Sauvegarder les paramètres
  useEffect(() => {
    localStorage.setItem('searchSettings', JSON.stringify(settings));
  }, [settings]);

  // Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 20)));
  }, [searchHistory]);

  // Géolocalisation automatique
  useEffect(() => {
    if (currentLocation && !userLocation) {
      setUserLocation([currentLocation[0], currentLocation[1]]);
      if (settings.analyticsEnabled) {
        analyticsService.track('location_obtained', { method: 'auto' });
      }
    }
  }, [currentLocation, userLocation, setUserLocation, settings.analyticsEnabled]);

  // Fonction de recherche optimisée avec cache
  const handleSearch = useCallback(async (query?: string, skipFilters?: boolean) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    console.log('🔍 Recherche:', { searchTerm, userLocation, skipFilters });

    // Vérifier le cache
    if (settings.cacheEnabled) {
      const cachedResults = await cacheService.get(searchTerm);
      if (cachedResults) {
        console.log('📦 Résultats depuis le cache');
        toast.info('Résultats chargés depuis le cache');
        // Utiliser les résultats cachés
        return;
      }
    }

    // Ajouter à l'historique
    setSearchHistory(prev => {
      const newHistory = [searchTerm, ...prev.filter(h => h !== searchTerm)].slice(0, 20);
      return newHistory;
    });

    // Analytics
    if (settings.analyticsEnabled) {
      analyticsService.track('search_performed', {
        query: searchTerm,
        filters_active: manualFiltersActive,
        transport_mode: filters.transport,
        multi_directions: showMultiDirections
      });
    }

    // Recherche avec ou sans filtres
    if (!skipFilters && manualFiltersActive) {
      updateFilters({ query: searchTerm });
    }
    
    await performSearch(searchTerm);

    // Mettre en cache les résultats si applicable
    if (settings.cacheEnabled && results.length > 0) {
      await cacheService.set(searchTerm, results);
    }

    // Si multi-directions est activé, calculer les routes
    if (showMultiDirections && results.length > 0) {
      await calculateMultiRoutes(results.slice(0, settings.maxResults));
    }

    // Afficher les résultats sur mobile
    if (isMobile && results.length > 0) {
      setShowFilters(true);
    }
  }, [searchQuery, userLocation, manualFiltersActive, filters, showMultiDirections, settings, performSearch, updateFilters]);

  // Calculer les routes multiples
  const calculateMultiRoutes = async (destinations: any[]) => {
    if (!userLocation && !selectedOriginAddress) {
      toast.error('Veuillez définir un point de départ');
      return;
    }

    const origin = searchOrigin === 'position' 
      ? userLocation 
      : selectedOriginAddress?.coordinates;

    if (!origin) return;

    try {
      const routes: RouteData[] = await Promise.all(
        destinations.map(async (dest, index) => {
          const routeData = await fetchRoute(origin, dest.coordinates, filters.transport);
          return {
            id: `route-${index}`,
            coordinates: routeData.geometry.coordinates,
            color: getTransportColor(filters.transport, index),
            distance: routeData.distance,
            duration: routeData.duration,
            origin: origin as [number, number],
            destination: dest.coordinates,
            poiInfo: {
              name: dest.name,
              category: dest.category || 'POI',
              rating: dest.rating
            }
          };
        })
      );

      setMultiRoutes(routes);
      
      // Analytics
      if (settings.analyticsEnabled) {
        analyticsService.track('multi_routes_calculated', {
          count: routes.length,
          transport: filters.transport,
          origin_type: searchOrigin
        });
      }
    } catch (error) {
      toast.error('Erreur lors du calcul des itinéraires');
      console.error(error);
    }
  };

  // Fonction pour récupérer une route via Mapbox
  const fetchRoute = async (origin: [number, number], destination: [number, number], mode: string) => {
    const profile = getMapboxProfile(mode);
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    
    const response = await fetch(`${url}?` + new URLSearchParams({
      access_token: mapboxToken,
      geometries: 'geojson',
      language: 'fr',
      overview: 'full'
    }));

    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      return {
        geometry: data.routes[0].geometry,
        distance: data.routes[0].distance / 1000,
        duration: data.routes[0].duration / 60
      };
    }
    
    throw new Error('Aucune route trouvée');
  };

  // Helpers
  const getMapboxProfile = (mode: string) => {
    switch (mode) {
      case 'walking': return 'walking';
      case 'cycling': return 'cycling';
      case 'driving': return 'driving';
      case 'transit': return 'driving';
      default: return 'driving';
    }
  };

  const getTransportColor = (mode: string, index: number) => {
    const baseColors = {
      walking: '#10B981',
      cycling: '#3B82F6',
      driving: '#F59E0B',
      transit: '#8B5CF6'
    };
    
    // Variation de couleur pour différencier les tracés
    const variations = [0, 20, -20];
    const baseColor = baseColors[mode as keyof typeof baseColors] || '#6B7280';
    
    return adjustColor(baseColor, variations[index % 3]);
  };

  const adjustColor = (color: string, amount: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Gestionnaires d'événements
  const handleGetMyLocation = async () => {
    try {
      await getCurrentLocation();
      toast.success('Position obtenue avec succès');
      if (settings.analyticsEnabled) {
        analyticsService.track('location_obtained', { method: 'manual' });
      }
    } catch (error) {
      toast.error('Impossible d\'obtenir votre position');
    }
  };

  const handleFiltersChange = (key: string, value: any) => {
    setManualFiltersActive(true);
    updateFilters({ [key]: value });
    
    if (filters.query) {
      performSearch(filters.query);
    }

    if (settings.analyticsEnabled) {
      analyticsService.track('filter_changed', { filter: key, value });
    }
  };

  const handleExportPDF = () => {
    // TODO: Implémenter l'export PDF
    toast.info('Export PDF en développement');
  };

  const handleShare = () => {
    const shareData = {
      title: 'Recherche LocaSimple',
      text: `Itinéraire: ${searchQuery}`,
      url: window.location.href
    };

    if (navigator.share && isMobile) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }

    if (settings.analyticsEnabled) {
      analyticsService.track('share_initiated', { method: navigator.share ? 'native' : 'clipboard' });
    }
  };

  const handleNavigate = (poi: any, app: string) => {
    if (settings.analyticsEnabled) {
      analyticsService.track('navigation_launched', {
        poi_name: poi.name,
        app: app,
        transport: filters.transport
      });
    }
  };

  const toggleMultiDirections = () => {
    setShowMultiDirections(!showMultiDirections);
    setSettings(prev => ({ ...prev, multiDirections: !prev.multiDirections }));
    
    if (!showMultiDirections && results.length > 0) {
      calculateMultiRoutes(results.slice(0, settings.maxResults));
    }
  };

  // Optimisation avec debounce pour la recherche
  const debouncedSearch = useMemo(
    () => debounce((query: string) => handleSearch(query, false), 300),
    [handleSearch]
  );

  return (
    <>
      <SEOHead 
        title="Recherche Multi-directionnelle - LocaSimple"
        description="Recherchez et comparez plusieurs itinéraires simultanément. Visualisez jusqu'à 3 tracés sur la carte avec toutes les informations."
        keywords="multi-directions, itinéraire multiple, recherche POI, navigation, comparaison trajets"
      />
      
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Header avec recherche et actions */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-2 p-2">
            {/* Barre de recherche améliorée */}
            <div className="flex-1 max-w-3xl">
              <EnhancedSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => handleSearch(query, !manualFiltersActive)}
                onLocationSelect={(location) => {
                  setUserLocation(location.coordinates);
                  setSelectedLocation(location);
                  handleSearch(location.name, false);
                }}
                userLocation={userLocation}
                placeholder="Rechercher un lieu, restaurant, établissement..."
                recentSearches={searchHistory}
                mapboxToken={mapboxToken}
              />
            </div>
            
            {/* Actions principales */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGetMyLocation}
                className="h-8 w-8 p-0"
                title="Ma position"
              >
                <Navigation className="w-4 h-4" />
              </Button>
              
              <Button
                variant={showMultiDirections ? 'default' : 'ghost'}
                size="sm"
                onClick={toggleMultiDirections}
                className="h-8 w-8 p-0"
                title="Multi-directions"
              >
                <Layers className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportPDF}
                className="h-8 w-8 p-0"
                title="Exporter"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <OptimizedFilterButton
                onClick={() => setShowFilters(!showFilters)}
                filters={filters}
                distanceMode={distanceMode}
              />
            </div>
          </div>

          {/* Barre de statut multi-directions */}
          {showMultiDirections && (
            <div className="px-4 py-2 bg-primary/10 border-t">
              <MultiDirectionalSearch
                searchOrigin={searchOrigin}
                onSearchOriginChange={setSearchOrigin}
                selectedOriginAddress={selectedOriginAddress}
                onOriginAddressChange={setSelectedOriginAddress}
                userAddresses={userAddresses}
                maxResults={settings.maxResults}
                onMaxResultsChange={(value) => setSettings(prev => ({ ...prev, maxResults: value }))}
                routeCount={multiRoutes.length}
              />
            </div>
          )}
        </div>

        {/* Carte principale */}
        <div className="w-full h-full pt-16">
          <MapboxSearchMap />
        </div>

        {/* Panneau latéral enrichi - Desktop */}
        {!isMobile && (
          <div 
            className={`fixed top-16 right-0 h-[calc(100vh-4rem)] z-30 transition-all duration-300 bg-background border-l shadow-lg ${
              showFilters || results.length > 0
                ? 'w-96 translate-x-0' 
                : 'w-0 translate-x-full overflow-hidden'
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Header du panneau */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">
                  {results.length > 0 
                    ? `${results.length} résultat${results.length > 1 ? 's' : ''}` 
                    : 'Filtres'
                  }
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Contenu du panneau */}
              <div className="flex-1 overflow-auto">
                {/* Filtres avancés */}
                <div className="p-4 border-b">
                  <ModernFilterPanel
                    filters={{
                      transport: filters.transport,
                      distance: filters.distance,
                      unit: filters.unit || 'km',
                      aroundMeCount: filters.aroundMeCount || 3,
                      category: Array.isArray(filters.category) ? filters.category[0] || '' : filters.category || '',
                      maxDuration: filters.maxDuration || 30
                    }}
                    onFilterChange={handleFiltersChange}
                    distanceMode={distanceMode}
                    onDistanceModeChange={setDistanceMode}
                  />
                </div>

                {/* Liste des résultats */}
                {results.length > 0 && (
                  <div className="p-4 space-y-3">
                    {results.map((result, index) => (
                      <Card key={result.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{result.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">{result.address}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {distanceMode === 'distance' 
                              ? `${result.distance?.toFixed(1) || '0'} km`
                                : `${Math.round(Number(result.duration || 0))} min`
                            }
                          </span>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedLocation(result)}
                            className="h-6 px-2 text-xs"
                          >
                            Détails
                          </Button>
                        </div>

                        {/* Route info si multi-directions */}
                        {showMultiDirections && multiRoutes[index] && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: multiRoutes[index].color }}
                              />
                              <span className="font-medium">Route {index + 1}</span>
                            </div>
                            <div className="text-muted-foreground">
                              {multiRoutes[index].distance.toFixed(1)} km • {Math.round(multiRoutes[index].duration)} min
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Panneau mobile */}
        {isMobile && (
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="bottom" className="h-[80vh]">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {results.length > 0 
                      ? `${results.length} résultat${results.length > 1 ? 's' : ''}` 
                      : 'Recherche'
                    }
                  </h3>
                </div>

                <Tabs defaultValue="results" className="flex-1">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="results">Résultats</TabsTrigger>
                    <TabsTrigger value="filters">Filtres</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results" className="flex-1 overflow-auto mt-4">
                    {results.length > 0 ? (
                      <div className="space-y-3">
                        {results.map((result, index) => (
                          <Card key={result.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{result.name}</h4>
                              <Badge variant="secondary">
                                {result.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{result.address}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {distanceMode === 'distance' 
                                  ? `${result.distance?.toFixed(1) || '0'} km`
                                  : `${Math.round(Number(result.duration || 0))} min`
                                }
                              </span>
                              
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedLocation(result)}
                              >
                                Voir détails
                              </Button>
                            </div>

                            {showMultiDirections && multiRoutes[index] && (
                              <div className="mt-3 p-2 bg-muted rounded">
                                <div className="flex items-center gap-2 mb-1">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: multiRoutes[index].color }}
                                  />
                                  <span className="font-medium text-sm">Route {index + 1}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {multiRoutes[index].distance.toFixed(1)} km • {Math.round(multiRoutes[index].duration)} min
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun résultat pour cette recherche
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="filters" className="flex-1 overflow-auto mt-4">
                    <ModernFilterPanel
                      filters={{
                        transport: filters.transport,
                        distance: filters.distance,
                        unit: filters.unit || 'km',
                        aroundMeCount: filters.aroundMeCount || 3,
                        category: Array.isArray(filters.category) ? filters.category[0] || '' : filters.category || '',
                        maxDuration: filters.maxDuration || 30
                      }}
                      onFilterChange={handleFiltersChange}
                      distanceMode={distanceMode}
                      onDistanceModeChange={setDistanceMode}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Popup de détails du lieu */}
        {selectedLocation && (
          <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {distanceMode === 'distance' 
                      ? `${selectedLocation.distance?.toFixed(1) || '0'} km`
                      : `${Math.round(selectedLocation.duration || 0)} min`
                    }
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleNavigate(selectedLocation, 'google')}
                >
                  Ouvrir dans Google Maps
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleNavigate(selectedLocation, 'waze')}
                >
                  Ouvrir dans Waze
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}