import React, { useState } from 'react';
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
  Filter
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
import EnhancedSearchBar from '../../enhanced/EnhancedSearchBar';
import SmartBreadcrumb from '../ui/SmartBreadcrumb';

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
  onShowFilters?: () => void;
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
  onShowFilters
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          {/* Navigation contextuelle */}
          <div className="flex items-center gap-2">
            <SmartBreadcrumb />
          </div>

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
            {onShowFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onShowFilters}
                title="Ouvrir les filtres"
                className="text-muted-foreground hover:text-foreground"
              >
                <Filter className="h-4 w-4" />
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

          {/* Menu utilisateur */}
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="@utilisateur" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">Utilisateur</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
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
    </div>
  );
};

export default GeoSearchHeader;