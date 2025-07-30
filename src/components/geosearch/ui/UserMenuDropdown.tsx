import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Heart, 
  Bookmark, 
  Crown, 
  Settings, 
  Bell, 
  LogOut,
  UserCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserMenuDropdownProps {
  className?: string;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/auth')}
          className="text-xs px-3 py-1"
        >
          Connexion
        </Button>
        <Button
          size="sm"
          onClick={() => navigate('/register')}
          className="text-xs px-3 py-1"
        >
          Inscription
        </Button>
      </div>
    );
  }

  // Menu pour utilisateur connecté
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback>
                <UserCircle className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {/* Indicateur de notifications */}
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 bg-white z-50" align="end" forceMount>
          {/* Informations utilisateur */}
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.user_metadata?.full_name && (
                <p className="font-medium">{user.user_metadata.full_name}</p>
              )}
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Navigation principale */}
          <DropdownMenuItem onClick={() => navigate('/account')}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/favorites')}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Mes favoris</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/saved')}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Recherches sauvegardées</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Premium */}
          <DropdownMenuItem onClick={() => navigate('/premium')}>
            <Crown className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Abonnement Premium</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              Pro
            </Badge>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Paramètres */}
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings?tab=notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <Badge variant="destructive" className="ml-auto text-xs">
              3
            </Badge>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Déconnexion */}
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenuDropdown;