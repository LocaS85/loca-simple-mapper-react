import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Navigation, Filter, Share2, Download, Layers, Settings, X, Home, Users, Building, GraduationCap, Car, Bike, Clock, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { debounce } from 'lodash';

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
  defaultTransport: string;
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
    defaultTransport: 'walking'
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
    updateFilters({ transport: 'walking' });

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

  // Initialize user location
  useEffect(() => {
    console.log('🌍 Initialisation géolocalisation:', { currentLocation, userLocation });
    
    if (currentLocation && !userLocation) {
      console.log('📍 Définition userLocation depuis currentLocation:', currentLocation);
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
    
    // Lancer la recherche
    await performSearch(searchTerm);

    // Mettre en cache les résultats après la recherche
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
  }, [searchQuery, userLocation, manualFiltersActive, filters, showMultiDirections, settings, performSearch, updateFilters, results]);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

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
    const mapboxToken = process.env.VITE_MAPBOX_TOKEN || '';
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

  const handleOpenInMaps = (service: 'google' | 'waze' | 'apple') => {
    if (!selectedLocation) return;
    
    const { coordinates } = selectedLocation;
    const [lng, lat] = coordinates;
    
    let url = '';
    switch (service) {
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        break;
      case 'apple':
        url = `http://maps.apple.com/?q=${lat},${lng}`;
        break;
    }
    
    window.open(url, '_blank');
    
    if (settings.analyticsEnabled) {
      analyticsService.track('navigation_launched', {
        poi_name: selectedLocation.name,
        app: service,
        transport: filters.transport
      });
    }
  };

  const quickActions = [
    { icon: Navigation, action: handleGetMyLocation },
    { icon: Layers, action: toggleMultiDirections },
    { icon: Download, action: handleExportPDF },
    { icon: Share2, action: handleShare },
    { icon: Filter, action: () => setShowFilters(!showFilters) }
  ];

  const getCategoryIcon = (categoryType: string) => {
    switch (categoryType) {
      case 'main': return Home;
      case 'family': return Users;
      case 'work': return Building;
      case 'school': return GraduationCap;
      default: return MapPin;
    }
  };

  const getCategoryColor = (categoryType: string) => {
    switch (categoryType) {
      case 'main': return '#3B82F6';
      case 'family': return '#10B981';
      case 'work': return '#F59E0B';
      case 'school': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const toggleAddressSelection = (addressId: string) => {
    setSelectedAddresses(prev => 
      prev.includes(addressId) 
        ? prev.filter(id => id !== addressId)
        : [...prev, addressId]
    );
  };

  return (
    <>
      <SEOHead 
        title="Recherche géolocalisée - LocaSimple"
        description="Recherchez des lieux autour de vous avec notre interface moderne. Planifiez vos itinéraires et gérez vos adresses personnelles."
        keywords="recherche, géolocalisation, itinéraire, carte, navigation"
      />
      
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Header compact avec icônes uniquement */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-1 p-2">
            <div className="flex-1 max-w-2xl">
              <EnhancedSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                onLocationSelect={(location) => {
                  console.log('📍 Lieu sélectionné:', location);
                  setUserLocation(location.coordinates);
                  setSelectedLocation(location);
                  handleSearch(location.name);
                }}
                userLocation={userLocation}
                placeholder="Rechercher des lieux..."
                recentSearches={searchHistory}
                className="flex-1"
              />
            </div>
            
            {/* Actions icônes uniquement - Desktop */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {quickActions.slice(0, -1).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="h-8 w-8 p-0"
                  >
                    <action.icon className="w-4 h-4" />
                  </Button>
                ))}
                <OptimizedFilterButton
                  onClick={() => setShowFilters(!showFilters)}
                  filters={filters}
                  distanceMode={distanceMode}
                />
              </div>
            )}

            {/* Actions icônes uniquement - Mobile */}
            {isMobile && (
              <div className="flex items-center gap-1">
                {quickActions.slice(0, -1).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    className="h-8 w-8 p-0"
                  >
                    <action.icon className="w-4 h-4" />
                  </Button>
                ))}
                <OptimizedFilterButton
                  onClick={() => setShowFilters(!showFilters)}
                  filters={filters}
                  distanceMode={distanceMode}
                />
              </div>
          </div>
        </div>

        {/* Barre de statut multi-directions */}
        {showMultiDirections && (
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
        )}
      </div>

        {/* Panneau latéral enrichi - Desktop */}
        {!isMobile && showFilters && (
          <div className="w-80 border-r bg-card overflow-y-auto" style={{ marginTop: '57px' }}>
            <div className="p-4 space-y-6">
              
              {/* Section 1: Filtres modernes */}
              <div>
                <ModernFilterPanel
                  filters={{
                    transport: filters.transport,
                    distance: filters.distance,
                    unit: filters.unit,
                    aroundMeCount: filters.aroundMeCount || 10,
                    category: Array.isArray(filters.category) ? filters.category[0] : filters.category,
                    maxDuration: filters.maxDuration || 30,
                    showMultiDirections: filters.showMultiDirections
                  }}
                  distanceMode={distanceMode}
                  onFilterChange={(key, value) => handleFiltersChange(key, value)}
                  onClearFilter={(key) => {
                    if (key === 'transport') handleFiltersChange('transport', 'walking');
                    else if (key === 'distance') handleFiltersChange('distance', 5);
                    else if (key === 'maxDuration') handleFiltersChange('maxDuration', 30);
                    else if (key === 'aroundMeCount') handleFiltersChange('aroundMeCount', 10);
                    else if (key === 'category') handleFiltersChange('category', null);
                  }}
                  onDistanceModeChange={setDistanceMode}
                />
              </div>

              <Separator />

              {/* Section 2: Mes Adresses */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Mes Adresses</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userAddresses.map((address) => {
                    const Icon = getCategoryIcon(address.category_type || 'main');
                    const color = getCategoryColor(address.category_type || 'main');
                    const isSelected = selectedAddresses.includes(address.id);
                    
                    return (
                      <Card 
                        key={address.id}
                        className={`p-3 cursor-pointer transition-all duration-200 ${
                          isSelected ? 'border-2 shadow-md' : 'hover:bg-accent'
                        }`}
                        style={{ borderColor: isSelected ? color : undefined }}
                        onClick={() => toggleAddressSelection(address.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{address.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{address.address}</p>
                            {address.role && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full text-white mt-1 inline-block"
                                style={{ backgroundColor: color }}
                              >
                                {address.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Section 3: Résultats de recherche */}
              {results.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Résultats ({results.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {results.map((result, index) => (
                      <Card 
                        key={index}
                        className="p-3 hover:bg-accent cursor-pointer"
                        onClick={() => handleLocationSelect(result)}
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{result.name}</h4>
                          <p className="text-xs text-muted-foreground">{result.address}</p>
                          {result.distance && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Map className="w-3 h-3" />
                              {result.distance.toFixed(1)} km
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panneau latéral - Mobile avec tabs */}
        {isMobile && (
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Filtres et Options</h3>
                
                <Tabs defaultValue="filtres" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="filtres">Filtres</TabsTrigger>
                    <TabsTrigger value="adresses">Mes Adresses</TabsTrigger>
                    <TabsTrigger value="resultats">Résultats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="filtres" className="space-y-4 mt-4">
                    <ModernFilterPanel
                      filters={{
                        transport: filters.transport,
                        distance: filters.distance,
                        unit: filters.unit,
                        aroundMeCount: filters.aroundMeCount || 10,
                        category: Array.isArray(filters.category) ? filters.category[0] : filters.category,
                        maxDuration: filters.maxDuration || 30,
                        showMultiDirections: filters.showMultiDirections
                      }}
                      distanceMode={distanceMode}
                      onFilterChange={(key, value) => handleFiltersChange(key, value)}
                      onClearFilter={(key) => {
                        if (key === 'transport') handleFiltersChange('transport', 'walking');
                        else if (key === 'distance') handleFiltersChange('distance', 5);
                        else if (key === 'maxDuration') handleFiltersChange('maxDuration', 30);
                        else if (key === 'aroundMeCount') handleFiltersChange('aroundMeCount', 10);
                        else if (key === 'category') handleFiltersChange('category', null);
                      }}
                      onDistanceModeChange={setDistanceMode}
                      className="space-y-4"
                    />
                  </TabsContent>

                  <TabsContent value="adresses" className="space-y-2 mt-4">
                    {userAddresses.map((address) => {
                      const Icon = getCategoryIcon(address.category_type || 'main');
                      const color = getCategoryColor(address.category_type || 'main');
                      const isSelected = selectedAddresses.includes(address.id);
                      
                      return (
                        <Card 
                          key={address.id}
                          className={`p-3 cursor-pointer transition-all ${
                            isSelected ? 'border-2 shadow-md' : 'hover:bg-accent'
                          }`}
                          style={{ borderColor: isSelected ? color : undefined }}
                          onClick={() => toggleAddressSelection(address.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: color }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{address.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{address.address}</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="resultats" className="space-y-2 mt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      {results.length > 0 ? `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}` : 'Aucun résultat'}
                    </div>
                    {results.length > 0 ? (
                      results.map((result, index) => (
                        <Card 
                          key={index}
                          className="p-3 hover:bg-accent"
                          onClick={() => {
                            handleLocationSelect(result);
                            setShowFilters(false);
                          }}
                        >
                          <div>
                            <h5 className="font-medium text-sm">{result.name}</h5>
                            <p className="text-xs text-muted-foreground">{result.address}</p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Aucun résultat pour l'instant</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Carte principale */}
        <div className="flex-1 relative" style={{ marginTop: '57px' }}>
          <MapboxSearchMap
            results={results}
            userLocation={userLocation}
            onLocationChange={setUserLocation}
            selectedAddresses={selectedAddresses}
            transportMode={filters.transport}
            className="w-full h-full"
          />

          {/* Légende interactive avec multi-tracés */}
          {selectedAddresses.length > 0 && (
            <Card className="absolute bottom-4 right-4 p-3 bg-background/95 backdrop-blur">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Itinéraires actifs</h4>
                <div className="space-y-1">
                  {selectedAddresses.map((addressId) => {
                    const address = userAddresses.find(addr => addr.id === addressId);
                    if (!address) return null;
                    
                    const color = getCategoryColor(address.category_type || 'main');
                    
                    return (
                      <div key={addressId} className="flex items-center gap-2 text-xs">
                        <div 
                          className="w-3 h-1 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate max-w-20">{address.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Boutons flottants mobile */}
          {isMobile && (
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGetMyLocation}
                className="h-10 w-10 p-0 rounded-full shadow-lg"
              >
                <Navigation className="w-4 h-4" />
              </Button>
              <OptimizedFilterButton
                onClick={() => setShowFilters(!showFilters)}
                filters={filters}
                distanceMode={distanceMode}
              />
            </div>
          )}

          {/* Status indicators */}
          {isLoading && (
            <Card className="absolute top-4 left-4 p-3 bg-background/95 backdrop-blur">
              <div className="flex items-center gap-2 text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Recherche en cours...</span>
              </div>
            </Card>
          )}

          {results.length > 0 && (
            <Card className="absolute top-4 left-4 p-2 bg-background/95 backdrop-blur">
              <Badge variant="secondary">
                {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </Badge>
            </Card>
          )}
        </div>

        {/* Popup détails lieu */}
        {selectedLocation && (
          <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 w-80 z-50 bg-background border shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleOpenInMaps('google')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Ouvrir dans Google Maps
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleOpenInMaps('waze')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
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