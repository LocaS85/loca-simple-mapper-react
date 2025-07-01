import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  MapPin, 
  User, 
  Heart, 
  Settings, 
  LogOut, 
  Search,
  Grid3X3,
  Info
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Accueil', icon: <MapPin className="w-4 h-4" /> },
  { path: '/geosearch', label: 'Recherche', icon: <Search className="w-4 h-4" /> },
  { path: '/categories', label: 'Catégories', icon: <Grid3X3 className="w-4 h-4" /> },
  { path: '/about', label: 'À Propos', icon: <Info className="w-4 h-4" /> },
];

const ResponsiveNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  // Mobile Navigation
  if (isMobile) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">LocaSimple</span>
          </Link>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="p-2">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <Link to="/" className="flex items-center space-x-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                      <MapPin className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">LocaSimple</span>
                    </Link>

                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                            isActivePath(item.path)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user?.user_metadata?.full_name || 'Utilisateur'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        <Link
                          to="/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Mon Compte</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Favoris</span>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full">Se connecter</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop Navigation
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LocaSimple</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoris
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user?.user_metadata?.full_name || 'Utilisateur'}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mon Compte
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Favoris
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link to="/auth">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ResponsiveNavigation;