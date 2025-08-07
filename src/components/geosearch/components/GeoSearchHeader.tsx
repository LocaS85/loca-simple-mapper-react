import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  LocateFixed, 
  User, 
  Heart, 
  History, 
  Settings, 
  LogOut,
  ChevronDown,
  Filter,
  Menu,
  SlidersHorizontal,
  Search,
  Activity,
  Car,
  PersonStanding,
  Bike,
  Bus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import SmartBreadcrumb from '../ui/SmartBreadcrumb';
import { GeolocationStatus } from './GeolocationStatus';
import { NetworkQualityIndicator } from './NetworkQualityIndicator';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import MultiMapToggle from '../MultiMapToggle';

interface GeoSearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  userLocation: [number, number] | null;
  resultsCount: number;
  isLoading: boolean;
  onMyLocationClick: () => void;
  isLocating?: boolean;
  locationError?: string | null;
}

const GeoSearchHeader: React.FC<GeoSearchHeaderProps> = ({
  searchQuery,
  onSearch,
  onLocationSelect,
  userLocation,
  resultsCount,
  isLoading,
  onMyLocationClick,
  isLocating = false,
  locationError = null,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const { filters, updateFilters, toggleSidebar } = useGeoSearchStore();

  const handleLocationClick = () => {
    if (isLocating) return;
    onMyLocationClick();
    if (!userLocation) {
      toast.info("Recherche de votre position...");
    }
  };

  const handleSaveSearch = () => {
    toast.success("Recherche sauvegardée");
  };

  const handleShareSearch = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien de la recherche copié");
  };

  const getLocationButtonState = () => {
    if (isLocating) return 'loading';
    if (locationError) return 'error';
    if (userLocation) return 'active';
    return 'default';
  };

  const locationButtonClass = {
    default: "text-muted-foreground hover:text-foreground hover:bg-muted",
    loading: "text-primary bg-primary/10 animate-pulse",
    active: "text-primary bg-primary/10",
    error: "text-destructive hover:text-destructive hover:bg-destructive/10"
  };

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm z-20">
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center gap-3">
          {/* Bouton retour simple */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/categories')}
            className="text-muted-foreground hover:text-foreground"
            title="Retour aux catégories"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Bouton Ma position - Icône uniquement */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLocationClick}
            disabled={isLocating}
            className={locationButtonClass[getLocationButtonState()]}
            title={
              isLocating ? "Localisation en cours..." :
              locationError ? `Erreur: ${locationError}` :
              userLocation ? "Position détectée" :
              "Détecter ma position"
            }
          >
            <LocateFixed 
              className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} 
            />
          </Button>

          {/* Barre de recherche - Responsive */}
          <div className="flex-1 max-w-xs md:max-w-lg">
            <EnhancedSearchBar
              value={searchQuery}
              onSearch={onSearch}
              onLocationSelect={onLocationSelect}
              placeholder="Rechercher un lieu..."
              className="w-full text-sm"
            />
          </div>

          {/* Indicateurs de statut */}
          <div className="flex items-center gap-2">
            {userLocation && (
              <Badge 
                variant="outline" 
                className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5 hidden sm:flex"
              >
                Position OK
              </Badge>
            )}

            {resultsCount > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5"
              >
                {resultsCount}
              </Badge>
            )}

            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-1">
              <GeolocationStatus />
              <NetworkQualityIndicator />
              <MultiMapToggle />
              
              {/* Performance Monitor (development only) */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                  title="Moniteur de performance"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Activity className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveSearch}
                title="Sauvegarder cette recherche"
                className="text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Menu sandwich contextuel avec filtres */}
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full ml-auto"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="@utilisateur" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Menu className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* Section recherche rapide */}
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Recherche rapide</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      className="bg-primary text-primary-foreground cursor-pointer" 
                      onClick={() => onSearch('restaurant')}
                    >
                      restaurant
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => onSearch('pharmacie')}>
                      pharmacie
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer" onClick={() => onSearch('banque')}>
                      banque
                    </Badge>
                  </div>
                </div>

                {/* Section filtres */}
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Filtres de recherche</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-start"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres de recherche
                  </Button>
                </div>

                {/* Section transport */}
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 text-primary">🚗</div>
                    <span className="font-medium text-sm">Transport</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      className={`cursor-pointer ${filters.transport === 'walking' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}
                      onClick={() => updateFilters({ transport: 'walking' })}
                    >
                      À pied
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${filters.transport === 'driving' ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}
                      onClick={() => updateFilters({ transport: 'driving' })}
                    >
                      Voiture
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${filters.transport === 'cycling' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}
                      onClick={() => updateFilters({ transport: 'cycling' })}
                    >
                      Vélo
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${filters.transport === 'transit' ? 'bg-purple-500 text-white' : 'bg-muted text-muted-foreground'}`}
                      onClick={() => updateFilters({ transport: 'transit' })}
                    >
                      Transport
                    </Badge>
                  </div>
                </div>

                <DropdownMenuSeparator />
                
                {/* Actions utilisateur */}
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon compte</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/favorites')}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Mes favoris</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/saved')}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Historique</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Barre d'état contextuelle mobile */}
        {isMobile && (
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {userLocation && <span>📍 Position détectée</span>}
              {resultsCount > 0 && <span>• {resultsCount} résultats</span>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShareSearch}
              className="text-xs h-6 px-2"
            >
              Partager
            </Button>
          </div>
        )}
      </div>
      
      {/* Performance Monitor (development) */}
      {showPerformanceMonitor && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full left-0 right-0 z-50 p-4 bg-background border-b">
          <PerformanceMonitor />
        </div>
      )}
    </div>
  );
};

export default GeoSearchHeader;