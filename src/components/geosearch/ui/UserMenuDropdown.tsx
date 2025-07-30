import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  History, 
  Settings, 
  LogOut,
  CreditCard,
  Bell,
  MapPin
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserMenuDropdownProps {
  className?: string;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      navigate('/');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/auth')}
          className="text-muted-foreground hover:text-foreground"
        >
          Se connecter
        </Button>
        <Button
          size="sm"
          onClick={() => navigate('/auth')}
        >
          S'inscrire
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`relative h-9 w-9 rounded-full ${className || ''}`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url} 
              alt={user?.user_metadata?.full_name || 'Utilisateur'} 
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          {/* Indicateur de notifications */}
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background">
            <span className="sr-only">Nouvelles notifications</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* Profil utilisateur */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.full_name || 'Utilisateur'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Paris
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Navigation principale */}
        <DropdownMenuItem onClick={() => navigate('/account')}>
          <User className="mr-2 h-4 w-4" />
          <span>Mon compte</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/favorites')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Mes favoris</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            12
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/saved')}>
          <History className="mr-2 h-4 w-4" />
          <span>Recherches sauvegardées</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Services premium */}
        <DropdownMenuItem onClick={() => navigate('/premium')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Abonnement Premium</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <div className="ml-auto h-2 w-2 bg-destructive rounded-full" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Déconnexion */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;